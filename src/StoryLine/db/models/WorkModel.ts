import { Model, Q, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'

import {
    CharacterDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType,
    SectionDataType,
    WorkDataType
} from './types'

import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'
import NoteModel from './NoteModel'
import SectionModel from './SectionModel'

export default class WorkModel extends Model {
    static table = 'work'
    public static associations: Associations = {
        character: { type: 'has_many', foreignKey: 'work_id' },
        item: { type: 'has_many', foreignKey: 'work_id' },
        location: { type: 'has_many', foreignKey: 'work_id' },
        note: { type: 'has_many', foreignKey: 'work_id' },
        section: { type: 'has_many', foreignKey: 'work_id' }
    }
    @text('title') title!: string
    @text('author') author!: string
    @text('summary') summary!: string
    @text('language') language!: string
    @field('word_goal') wordGoal!: number
    @date('deadline_at') deadlineAt!: Date
    @date('last_opened_at') lastOpenedAt!: Date
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @children('character') character!: Query<CharacterModel>
    @children('item') item!: Query<ItemModel>
    @children('location') location!: Query<LocationModel>
    @children('note') note!: Query<NoteModel>
    @children('section') section!: Query<SectionModel>

    @lazy parts = this.section.extend(Q.where('mode', 'part'), Q.sortBy('order', Q.asc))

    @lazy chapters = this.section.extend(
        Q.where('work_id', this.id),
        Q.where('mode', 'chapter'),
        Q.sortBy('order', Q.asc)
    )

    @lazy scenes = this.section.extend(
        Q.where('work_id', this.id),
        Q.where('mode', 'scene'),
        Q.sortBy('order', Q.asc)
    )

    @lazy fabula = this.section.extend(
        Q.where('work_id', this.id),
        Q.where('mode', 'scene'),
        Q.sortBy('date', Q.asc)
    )

    @lazy mainCharacters = this.character.extend(
        Q.where('mode', 'primary'),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy secondaryCharacters = this.character.extend(
        Q.where('mode', 'secondary'),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy tertiaryCharacters = this.character.extend(
        Q.where('mode', 'tertiary'),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy notes = this.note.extend(Q.sortBy('title', Q.asc))

    @lazy items = this.item.extend(Q.sortBy('name', Q.asc))

    @lazy locations = this.location.extend(Q.sortBy('name', Q.asc))

    @writer async updateLastOpened() {
        await this.update((work) => {
            work.lastOpenedAt = new Date()
        })
    }

    @writer async updateWork(data: WorkDataType) {
        await this.update((work) => {
            work.title = data.title.toString()
            work.author = (data.author || '').toString()
            work.language = data.language
            work.wordGoal = data.wordGoal || null
            work.deadlineAt = data.deadlineAt || null
        })
    }

    @writer async addCharacter(data: CharacterDataType) {
        return await this.collections.get<CharacterModel>('character').create((character) => {
            character.work.set(this)
            character.displayName = data.displayName
            character.mode = data.mode
        })
    }

    @writer async addItem(data: ItemDataType) {
        return await this.collections.get<ItemModel>('item').create((item) => {
            item.work.set(this)
            item.name = data.name
            item.body = data.body
            item.url = data.url
            item.image = data.image
        })
    }

    @writer async addNote(data: NoteDataType) {
        return await this.collections.get<NoteModel>('note').create((note) => {
            note.work.set(this)
            note.title = data.title
            note.body = data.body
            note.url = data.url
            note.image = data.image
            note.color = data.color
        })
    }

    @writer async addLocation(data: LocationDataType) {
        return await this.collections.get<LocationModel>('location').create((location) => {
            location.work.set(this)
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude
            location.longitude = data.longitude
            location.url = data.url
            location.image = data.image
        })
    }

    @writer async addPart(data: SectionDataType) {
        // eslint-disable-next-line max-statements
        return await this.collections.get<SectionModel>('section').create((section) => {
            section.work.set(this)
            section.title = data.title
            section.description = data.description
            section.body = data.body
            section.date = data.date
            section.order = data.order
            section.words = data.words
            section.mode = 'part'
            section.deadlineAt = data.deadlineAt
        })
    }

    // ToDo finish search
    async search(query: string, sceneOnly: boolean, caseSensitive: boolean, fullWord: boolean) {
        const regex = new RegExp(fullWord ? `\\b${query}\\b` : query, caseSensitive ? 'g' : 'gi')

        if (sceneOnly) {
            const scenes = await this.scenes.fetch()
            const results = scenes.filter((scene) => scene.body.match(regex))
            return results
        }
    }
}
