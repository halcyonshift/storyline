import { Model, Q, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status, type StatusType } from '@sl/constants/status'
import {
    CharacterDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType,
    WorkDataType
} from './types'

import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'
import NoteModel from './NoteModel'
import SectionModel from './SectionModel'
import StatisticModel from './StatisticModel'

export default class WorkModel extends Model {
    static table = 'work'
    public static associations: Associations = {
        character: { type: 'has_many', foreignKey: 'work_id' },
        item: { type: 'has_many', foreignKey: 'work_id' },
        location: { type: 'has_many', foreignKey: 'work_id' },
        note: { type: 'has_many', foreignKey: 'work_id' },
        section: { type: 'has_many', foreignKey: 'work_id' },
        statistic: { type: 'has_many', foreignKey: 'work_id' }
    }
    @field('status') status!: StatusType
    @text('title') title!: string
    @text('author') author!: string
    @text('summary') summary!: string
    @text('language') language!: string
    @field('word_goal') wordGoal!: number
    @field('image') image!: string
    @date('deadline_at') deadlineAt!: Date
    @date('last_opened_at') lastOpenedAt!: Date
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @children('character') character!: Query<CharacterModel>
    @children('item') item!: Query<ItemModel>
    @children('location') location!: Query<LocationModel>
    @children('note') note!: Query<NoteModel>
    @children('section') section!: Query<SectionModel>
    @children('statistic') statistic!: Query<StatisticModel>

    // ToDo finish search
    async search(query: string, sceneOnly: boolean, caseSensitive: boolean, fullWord: boolean) {
        const regex = new RegExp(fullWord ? `\\b${query}\\b` : query, caseSensitive ? 'g' : 'gi')

        if (sceneOnly) {
            const scenes = await this.scenes.fetch()
            const results = scenes.filter((scene) => scene.body.match(regex))
            return results
        }
    }

    @lazy parts = this.section.extend(Q.where('mode', SectionMode.PART), Q.sortBy('order', Q.asc))

    @lazy chapters = this.section.extend(
        Q.where('work_id', this.id),
        Q.where('mode', SectionMode.CHAPTER),
        Q.sortBy('order', Q.asc)
    )

    @lazy scenes = this.section.extend(
        Q.where('work_id', this.id),
        Q.where('mode', SectionMode.SCENE),
        Q.sortBy('order', Q.asc)
    )

    @lazy primaryCharacters = this.character.extend(
        Q.where('mode', CharacterMode.PRIMARY),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy secondaryCharacters = this.character.extend(
        Q.where('mode', CharacterMode.SECONDARY),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy tertiaryCharacters = this.character.extend(
        Q.where('mode', CharacterMode.TERTIARY),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

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
            work.summary = data.summary
            work.wordGoal = Number(data.wordGoal) || null
            work.image = data.image
            work.deadlineAt = data.deadlineAt || null
        })
    }

    @writer async addCharacter(mode: CharacterModeType, data: CharacterDataType) {
        return await this.collections.get<CharacterModel>('character').create((character) => {
            character.work.set(this)
            character.mode = mode
            character.image = data.image
            character.displayName = data.displayName
            character.description = data.description
            character.history = data.history
            character.pronouns = data.pronouns
            character.firstName = data.firstName
            character.lastName = data.lastName
            character.nickname = data.nickname
            character.nationality = data.nationality
            character.ethnicity = data.ethnicity
            character.placeOfBirth = data.placeOfBirth
            character.residence = data.residence
            character.gender = data.gender
            character.sexualOrientation = data.sexualOrientation
            character.dateOfBirth = data.dateOfBirth
            character.apparentAge = data.apparentAge
            character.religion = data.religion
            character.socialClass = data.socialClass
            character.education = data.education
            character.profession = data.profession
            character.finances = data.finances
            character.politicalLeaning = data.politicalLeaning
            character.face = data.face
            character.build = data.build
            character.height = data.height
            character.weight = data.weight
            character.hair = data.hair
            character.hairNatural = data.hairNatural
            character.distinguishingFeatures = data.distinguishingFeatures
            character.personalityPositive = data.personalityPositive
            character.personalityNegative = data.personalityNegative
            character.ambitions = data.ambitions
            character.fears = data.fears
            character.status = Status.TODO
        })
    }

    @writer async addItem(data: ItemDataType) {
        return await this.collections.get<ItemModel>('item').create((item) => {
            item.work.set(this)
            item.name = data.name
            item.body = data.body
            item.url = data.url
            item.image = data.image
            item.status = Status.TODO
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
            note.date = data.date
            note.status = Status.TODO
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
            location.status = Status.TODO
        })
    }

    @writer async addPart() {
        const count = await this.parts.fetchCount()
        return await this.collections.get<SectionModel>('section').create((section) => {
            section.work.set(this)
            section.order = count + 1
            section.mode = SectionMode.PART
            section.status = Status.TODO
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((work) => {
            work.status = status
        })
    }
}
