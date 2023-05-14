import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { displayDate, displayTime, displayDateTime, sortDate } from '@sl/utils'
import { ConnectionDataType } from './types'
import { CharacterModel, ItemModel, LocationModel, NoteModel, WorkModel } from '.'

export default class ConnectionModel extends Model {
    static table = 'connection'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' }
    }
    @text('body') body!: string
    @text('mode') mode!: string
    @field('table_a') tableA!: string
    @field('table_b') tableB!: string
    @field('id_a') idA!: string
    @field('id_b') idB!: string
    @field('to') to!: boolean
    @field('from') from!: boolean
    @text('date') date!: string
    @text('color') color!: string
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date

    get sortDate() {
        return sortDate(this.date)
    }

    get displayDate() {
        return displayDate(this.date)
    }

    get displayTime() {
        return displayTime(this.date)
    }

    get displayDateTime() {
        return displayDateTime(this.date)
    }

    async displayName() {
        const from = await this.fromRecord()
        const to = await this.toRecord()
        return `${from.displayName} ${this.mode} ${to.displayName}`
    }

    async fromRecord() {
        return await this.collections
            .get<CharacterModel | ItemModel | LocationModel | NoteModel>(this.tableA)
            .find(this.idA)
    }

    async toRecord() {
        return await this.collections
            .get<CharacterModel | ItemModel | LocationModel | NoteModel>(this.tableB)
            .find(this.idB)
    }

    @writer async updateRecord(data: Partial<ConnectionDataType>) {
        await this.update((connection) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(connection as any)[key] = value
            }
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
