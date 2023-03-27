import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import {
    children,
    date,
    field,
    lazy,
    readonly,
    relation,
    text,
    writer
} from '@nozbe/watermelondb/decorators'
import { type StatusType } from '@sl/constants/status'
import NoteModel from './NoteModel'
import WorkModel from './WorkModel'
import { ItemDataType } from './types'

export default class ItemModel extends Model {
    static table = 'item'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'item_id' }
    }
    @field('status') status!: StatusType
    @text('name') name!: string
    @text('body') body!: string
    @text('url') url!: string
    @field('image') image!: string
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') note!: Query<NoteModel>

    get displayName() {
        return this.name
    }

    async destroyPermanently(): Promise<void> {
        await this.note.destroyAllPermanently()
        return super.destroyPermanently()
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
        await this.destroyPermanently()
        return true
    }
}
