import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { LatLngExpression } from 'leaflet'
import { Status, type StatusType } from '@sl/constants/status'
import { BreadcrumbType, TabType } from '@sl/layouts/Work/types'
import { LocationDataType } from './types'
import { ConnectionModel, NoteModel, TagModel, WorkModel } from '.'

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

    async getBreadcrumbs(includeSelf = true): Promise<BreadcrumbType[]> {
        const work = await this.work.fetch()
        const locations = await work.location.fetch()

        const ancestors = []
        let parent = this.location.id

        while (parent) {
            const location = locations.find((location) => location.id === parent)
            if (location) {
                ancestors.unshift({
                    label: location.displayName,
                    tab: { id: location.id, mode: 'location' } as TabType
                })
                parent = location.location.id
            } else {
                parent = null
            }
        }

        if (includeSelf) {
            ancestors.push({
                label: this.displayName,
                tab: { id: this.id, mode: 'location' } as TabType
            })
        }

        return ancestors
    }

    async destroyPermanently(): Promise<void> {
        api.deleteFile(this.image)
        await this.collections
            .get<ConnectionModel>('connection')
            .query(Q.or(Q.where('id_a', this.id), Q.where('id_b', this.id)))
            .destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await this.tag.destroyAllPermanently()
        await super.destroyPermanently()
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

    @writer async updateRecord(data: Partial<LocationDataType>) {
        await this.update((location) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(location as any)[key] = value
            }
        })
    }

    @writer async delete() {
        const countChildren = await this.locations.fetchCount()
        if (countChildren) return
        await this.destroyPermanently()
        return true
    }
}
