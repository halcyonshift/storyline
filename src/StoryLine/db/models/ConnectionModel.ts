import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { DateTime } from 'luxon'
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
        const date = DateTime.fromSQL(this.date)
        return date.isValid ? date.toSeconds() : 0
    }

    async displayName() {
        const from = await this.fromRecord()
        const to = await this.toRecord()
        return `${from.displayName} ${this.mode} ${to.displayName}`
    }

    get displayDate() {
        const date = DateTime.fromSQL(this.date)
        return date.isValid ? date.toFormat('EEEE dd LLL yyyy') : this.date
    }

    get displayTime() {
        const date = DateTime.fromSQL(this.date)
        return date.isValid ? date.toFormat('H:mm') : this.date
    }

    get displayDateTime() {
        const date = DateTime.fromSQL(this.date)
        return date.isValid ? date.toFormat('EEEE dd LLL yyyy H:mm') : this.date
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

    @writer async updateConnection(data: ConnectionDataType) {
        await this.update((connection) => {
            connection.tableA = data.tableA
            connection.tableB = data.tableB
            connection.idA = data.idA
            connection.idB = data.idB
            connection.to = data.to
            connection.from = data.from
            connection.mode = data.mode
            connection.body = data.body
            connection.date = data.date
            connection.color = data.color
        })
    }

    @writer async updateDate(date: string) {
        await this.update((connection) => {
            connection.date = date
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
