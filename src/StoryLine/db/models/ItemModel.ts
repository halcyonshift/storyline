import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { type StatusType } from '@sl/constants/status'
import { ConnectionModel, NoteModel, SectionModel, TagModel, WorkModel } from './'
import { ItemDataType } from './types'
import { ImageType } from '@sl/components/Gallery/types'

export default class ItemModel extends Model {
    static table = 'item'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'item_id' },
        tag: { type: 'has_many', foreignKey: 'item_id' }
    }
    @field('status') status!: StatusType
    @text('name') name!: string
    @text('body') body!: string
    @text('url') url!: string
    @field('image') image!: string
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') note!: Query<NoteModel>
    @children('tag') tag!: Query<TagModel>

    get displayName() {
        return this.name
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
            const tagged = await scene.taggedItems(this.id)

            if (!tagged.length) continue

            appearances.push({
                scene,
                text: tagged[0].text
            })
        }

        return appearances
    }

    getExcerpts(scene: SectionModel): string[] {
        const excerpts: string[] = []

        new DOMParser()
            .parseFromString(scene.body, 'text/html')
            .querySelectorAll(`.tag-item`)
            .forEach((tag: HTMLAnchorElement) => {
                excerpts.push(tag.innerHTML)
            })

        return excerpts
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @writer async updateItem(data: ItemDataType) {
        await this.update((item) => {
            item.name = data.name
            item.body = data.body
            item.url = data.url
            item.image = data.image
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((item) => {
            item.status = status
        })
    }

    @writer async delete() {
        const connections = await this.collections
            .get<ConnectionModel>('connection')
            .query(Q.or(Q.where('id_a', this.id), Q.where('id_b', this.id)))
        connections.map((connection) => connection.delete())
        await this.tag.destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await this.destroyPermanently()
        return true
    }
}
