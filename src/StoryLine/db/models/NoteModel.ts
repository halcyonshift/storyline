import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import {
    children,
    date,
    field,
    readonly,
    relation,
    text,
    writer
} from '@nozbe/watermelondb/decorators'
import { DateTime } from 'luxon'
import { Status, type StatusType } from '@sl/constants/status'
import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'
import SectionModel from './SectionModel'
import WorkModel from './WorkModel'
import { NoteDataType } from './types'

export default class NoteModel extends Model {
    static table = 'note'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        character: { type: 'belongs_to', key: 'character_id' },
        item: { type: 'belongs_to', key: 'item_id' },
        location: { type: 'belongs_to', key: 'location_id' },
        note: { type: 'has_many', foreignKey: 'note_id' }
    }
    @field('status') status!: StatusType
    @text('title') title!: string
    @text('body') body!: string
    @text('date') date!: string
    @text('url') url!: string
    @field('image') image!: string
    @text('color') color!: string
    @field('order') order!: number
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('character', 'character_id') character!: Relation<CharacterModel>
    @relation('item', 'item_id') item!: Relation<ItemModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @relation('note', 'note_id') note!: Relation<NoteModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') notes!: Query<NoteModel>

    get displayName() {
        return this.title
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

    get sortDate() {
        const date = DateTime.fromSQL(this.date)
        return date.isValid ? date.toSeconds() : 0
    }

    @writer async addNote(data: NoteDataType) {
        const work = await this.work.fetch()
        return await this.collections.get<NoteModel>('note').create((note) => {
            note.note.set(this)
            note.work.set(work)
            note.title = data.title
            note.body = data.body
            note.color = data.color
            note.date = data.date
            note.url = data.url
            note.image = data.image
            note.status = Status.TODO
        })
    }

    @writer async updateNote(data: NoteDataType) {
        await this.update((note) => {
            note.title = data.title
            note.body = data.body
            note.color = data.color
            note.date = data.date
            note.url = data.url
            note.image = data.image
            note.order = Number(data.order)
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @writer async updateAssociation(owner: any) {
        await this.update((note) => {
            if (owner.table === 'character') note.character.set(owner)
            else if (owner.table === 'item') note.item.set(owner)
            else if (owner.table === 'location') note.location.set(owner)
            else if (owner.table === 'section') note.section.set(owner)
        })
    }

    @writer async delete() {
        const children = await this.notes.fetchCount()
        if (children) return false
        if (this.image) {
            api.deleteFile(this.image)
        }
        await this.destroyPermanently()
        return true
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((note) => {
            note.status = status
        })
    }
}
