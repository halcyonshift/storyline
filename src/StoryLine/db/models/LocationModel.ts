import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { LatLngExpression } from 'leaflet'
import { ImageType } from '@sl/components/Gallery/types'
import { Status, type StatusType } from '@sl/constants/status'
import { LocationDataType } from './types'
import { ConnectionModel, NoteModel, SectionModel, TagModel, WorkModel } from '.'

export default class LocationModel extends Model {
    static table = 'location'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'location_id' },
        location: { type: 'has_many', foreignKey: 'location_id' },
        tag: { type: 'has_many', foreignKey: 'location_id' }
    }
    @field('status') status!: StatusType
    @text('name') name!: string
    @text('body') body!: string
    @text('latitude') latitude!: string
    @text('longitude') longitude!: string
    @text('url') url!: string
    @field('image') image!: string
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @children('note') note!: Query<NoteModel>
    @children('location') locations!: Query<LocationModel>
    @children('tag') tag!: Query<TagModel>

    get displayName() {
        return this.name
    }

    get latLng(): LatLngExpression | null {
        if (this.latitude && this.longitude) {
            return [parseFloat(this.latitude), parseFloat(this.longitude)]
        }
        return null
    }

    async getLinks(): Promise<string[]> {
        const notes = await this.note.extend(Q.where('url', Q.notEq('')))
        return [this.url]
            .concat(notes.map((note) => note.url))
            .map((url) => url)
            .filter((link) => link)
    }

    async getImages(): Promise<ImageType[]> {
        const notes = await this.note.extend(Q.where('image', Q.notEq('')))
        const images = notes.map((note) => ({ path: note.image, title: note.title }))
        if (this.image) {
            return [{ path: this.image, title: this.name }]
                .concat(images)
                .filter((image) => image.path)
        }
        return images
    }

    async getAppearances() {
        const work = await this.work.fetch()
        const scenes = await work.scenes.fetch()

        const appearances = []

        for await (const scene of scenes) {
            const tagged = await scene.taggedLocations(this.id)

            if (!tagged.length) continue

            appearances.push({
                scene,
                text: tagged[0].text
            })
        }

        return appearances
    }

    async destroyPermanently(): Promise<void> {
        if (this.image) {
            api.deleteFile(this.image)
        }
        await this.collections
            .get<ConnectionModel>('connection')
            .query(Q.or(Q.where('id_a', this.id), Q.where('id_b', this.id)))
            .destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await this.tag.destroyAllPermanently()
        await super.destroyPermanently()
    }

    getExcerpts(scene: SectionModel): string[] {
        const excerpts: string[] = []

        new DOMParser()
            .parseFromString(scene.body, 'text/html')
            .querySelectorAll(`.tag-location`)
            .forEach((tag: HTMLAnchorElement) => {
                excerpts.push(tag.innerHTML)
            })

        return excerpts
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @writer async addLocation(data: LocationDataType) {
        const work = await this.work.fetch()
        return await this.collections.get<LocationModel>('location').create((location) => {
            location.location.set(this)
            location.work.set(work)
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude ? data.latitude.toString() : null
            location.longitude = data.longitude ? data.longitude.toString() : null
            location.url = data.url
            location.image = data.image
            location.status = Status.TODO
        })
    }

    @writer async updateLocation(data: LocationDataType) {
        await this.update((location) => {
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude ? data.latitude.toString() : null
            location.longitude = data.longitude ? data.longitude.toString() : null
            location.url = data.url
            location.image = data.image
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((location) => {
            location.status = status
        })
    }

    @writer async delete() {
        const countChildren = await this.locations.fetchCount()
        if (countChildren) return
        await this.destroyPermanently()
        return true
    }
}
