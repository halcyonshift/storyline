import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { type StatusType } from '@sl/constants/status'
import { ConnectionModel, NoteModel, TagModel, WorkModel } from './'
import { ItemDataType } from './types'

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

    async destroyPermanently(): Promise<void> {
        await this.collections
            .get<ConnectionModel>('connection')
            .query(Q.or(Q.where('id_a', this.id), Q.where('id_b', this.id)))
            .destroyAllPermanently()
        await this.tag.destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await super.destroyPermanently()
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @writer async updateRecord(data: Partial<ItemDataType>) {
        await this.update((item) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(item as any)[key] = value
            }
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
