import { Model, Q, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, text, writer } from '@nozbe/watermelondb/decorators'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status, type StatusType } from '@sl/constants/status'
import { SearchResultType } from '@sl/layouts/Work/Panel/Search/types'
import { wordCount } from '@sl/utils'
import {
    CharacterDataType,
    ConnectionDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType,
    WorkDataType
} from './types'
import {
    CharacterModel,
    ConnectionModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    StatisticModel
} from '.'
export default class WorkModel extends Model {
    static table = 'work'
    public static associations: Associations = {
        character: { type: 'has_many', foreignKey: 'work_id' },
        connection: { type: 'has_many', foreignKey: 'work_id' },
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
    @field('word_goal_per_day') wordGoalPerDay!: number
    @field('image') image!: string
    @date('deadline_at') deadlineAt!: Date
    @date('last_opened_at') lastOpenedAt!: Date
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @children('character') character!: Query<CharacterModel>
    @children('connection') connection!: Query<ConnectionModel>
    @children('item') item!: Query<ItemModel>
    @children('location') location!: Query<LocationModel>
    @children('note') note!: Query<NoteModel>
    @children('section') section!: Query<SectionModel>
    @children('statistic') statistic!: Query<StatisticModel>

    // ToDo finish search
    async search(
        query: string,
        sceneOnly: boolean,
        caseSensitive: boolean,
        fullWord: boolean
    ): Promise<SearchResultType[]> {
        const regex = new RegExp(
            fullWord
                ? `(?:(.{0,25})\\b(${query})\\b(.{0,25}))`
                : `(?:(.{0,25})(${query})(.{0,25}))`,
            caseSensitive ? 'g' : 'gi'
        )

        if (sceneOnly) {
            const scenes = await this.scenes.fetch()
            const results: SearchResultType[] = []
            scenes.map((scene) => {
                const text = scene.body.replace('</p>', ' ').replace(/(<([^>]+)>)/gi, '')
                const matches = [...text.matchAll(regex)]
                if (matches.length) {
                    const result: SearchResultType = {
                        id: scene.id,
                        label: scene.displayTitle,
                        link: `section/${scene.id}/${query}`,
                        excerpts: []
                    }
                    for (const match of matches) {
                        result.excerpts.push(
                            `${match[1] ? '...' : ''}${match[0]
                                .replace('&nbsp;', ' ')
                                .replace('\n', ' ')}${match[3] ? '...' : ''}`
                        )
                    }
                    results.push(result)
                }
            })

            return results
        }

        return []
    }

    async wordCount() {
        const scenes = await this.scenes.fetch()
        return scenes.reduce((count, scene) => count + wordCount(scene.body), 0)
    }

    async destroyPermanently(): Promise<void> {
        this.character.destroyAllPermanently()
        this.connection.destroyAllPermanently()
        this.item.destroyAllPermanently()
        this.location.destroyAllPermanently()
        this.note.destroyAllPermanently()
        this.section.destroyAllPermanently()
        return super.destroyPermanently()
    }

    @lazy sections = this.section.extend(Q.where('work_id', this.id), Q.sortBy('order', Q.asc))

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

    @lazy characters = this.character.extend(Q.sortBy('display_name', Q.asc))

    @lazy items = this.item.extend(Q.sortBy('name', Q.asc))

    @lazy locations = this.location.extend(Q.sortBy('name', Q.asc))

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @lazy statistics = this.collections
        .get<StatisticModel>('statistic')
        .query(
            Q.experimentalNestedJoin('section', 'work'),
            Q.on('section', Q.on('work', 'id', this.id))
        )

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

    @writer async addConnection(data: ConnectionDataType) {
        return await this.collections.get<ConnectionModel>('connection').create((connection) => {
            connection.work.set(this)
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
            note.order = data.order
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

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
