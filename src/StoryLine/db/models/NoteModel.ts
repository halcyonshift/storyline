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

import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'
import SectionModel from './SectionModel'
import WorkModel from './WorkModel'
import { NoteDataType } from './types'

export default class NoteModel extends Model {
    static table = 'note'
    public static associations: Associations = {
        character: { type: 'belongs_to', key: 'character_id' },
        item: { type: 'belongs_to', key: 'item_id' },
        location: { type: 'belongs_to', key: 'location_id' },
        note: { type: 'has_many', foreignKey: 'note_id' }
    }

    @text('title') title!: string
    @text('body') body!: string
    @date('date') date!: string
    @text('url') url!: string
    @field('image') image!: string
    @text('color') color!: string
    @text('order') order!: number
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('character', 'character_id') character!: Relation<CharacterModel>
    @relation('item', 'item_id') item!: Relation<ItemModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @relation('note', 'note_id') note!: Relation<NoteModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') notes!: Query<NoteModel>

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
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
