import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, relation, text, writer } from '@nozbe/watermelondb/decorators'
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
        note: { type: 'has_many', foreignKey: 'note_id' },
        section: { type: 'belongs_to', key: 'section_id' }
    }
    @field('status') status!: StatusType
    @text('title') title!: string
    @text('body') body!: string
    @text('date') date!: string
    @text('url') url!: string
    @field('image') image!: string
    @text('color') color!: string
    @field('order') order!: number
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
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

    async destroyPermanently(): Promise<void> {
        const children = await this.notes.fetchCount()
        if (children) return
        if (this.image) {
            api.deleteFile(this.image)
        }
        return super.destroyPermanently()
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

    @writer async updateAssociation(
        owner: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel
    ): Promise<void> {
        await this.update((note) => {
            switch (owner.table) {
                case 'character':
                    note.character.set(owner as CharacterModel)
                    break
                case 'item':
                    note.item.set(owner as ItemModel)
                    break
                case 'location':
                    note.location.set(owner as LocationModel)
                    break
                case 'note':
                    note.note.set(owner as NoteModel)
                    break
                case 'section':
                    note.section.set(owner as SectionModel)
                    break
            }
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((note) => {
            note.status = status
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
