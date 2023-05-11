/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Q, Query, ColumnName } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, text, writer } from '@nozbe/watermelondb/decorators'
import { DateTime, DurationLikeObject, DurationUnits, Interval } from 'luxon'
import percentRound from 'percent-round'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status, type StatusType } from '@sl/constants/status'
import schema from '@sl/db/schema'
import { SearchResultType } from '@sl/layouts/Work/Panel/Search/types'
import { t } from 'i18next'

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
    StatisticModel,
    TagModel
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
        statistic: { type: 'has_many', foreignKey: 'work_id' },
        tag: { type: 'has_many', foreignKey: 'work_id' }
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
    @children('tag') tag!: Query<StatisticModel>

    get displayDeadline() {
        if (!this.deadlineAt) return ''

        const date = DateTime.fromJSDate(this.deadlineAt)
        return date.isValid ? date.toFormat('EEEE dd LLL yyyy H:mm') : ''
    }

    get timeLeft() {
        if (!this.deadlineAt) return ''

        const deadline = DateTime.fromJSDate(this.deadlineAt)
        const now = DateTime.now()

        const units: DurationUnits = ['years', 'months', 'days', 'hours', 'minutes']

        const diff = deadline.diff(now, units)

        return units
            .reduce((duration, unit) => {
                const d = diff.get(unit as keyof DurationLikeObject)
                if (d) {
                    duration.push(`${Math.round(d)} ${t(`component.unit.${unit}`)}`)
                }
                return duration
            }, [])
            .join(' ')
    }

    wordsPerDay(currentWords: number) {
        if (!currentWords || !this.wordGoal) return 0
        const deadline = DateTime.fromJSDate(this.deadlineAt)
        const now = DateTime.now()
        const diff = Interval.fromDateTimes(now, deadline)
        if (isNaN(diff.length('days'))) return 0

        return Math.ceil((this.wordGoal - currentWords) / diff.length('days'))
    }

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

        const results: SearchResultType[] = []
        const scenes = await this.scenes.fetch()

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

        if (sceneOnly) return results

        const characters = await this.characters.fetch()
        const notes = await this.notes.fetch()
        const locations = await this.locations.fetch()
        const items = await this.items.fetch()

        const characterFields = [
            'displayName',
            'firstName',
            'lastName',
            'description',
            'history',
            'pronouns',
            'nickname',
            'nationality',
            'ethnicity',
            'placeOfBirth',
            'residence',
            'gender',
            'sexualOrientation',
            'religion',
            'socialClass',
            'profession',
            'finances',
            'politicalLeaning',
            'face',
            'build',
            'hair',
            'hairNatural',
            'distinguishingFeatures',
            'personalityPositive',
            'personalityNegative',
            'ambitions',
            'fears'
        ]

        characters.map((character) => {
            const result: SearchResultType = {
                id: character.id,
                label: character.displayName,
                link: `character/${character.id}`,
                excerpts: []
            }

            characterFields.map((field) => {
                const text = (character[field as keyof CharacterModel] || '')
                    .toString()
                    .replace('</p>', ' ')
                    .replace(/(<([^>]+)>)/gi, '')
                const matches = [...text.matchAll(regex)]
                if (matches.length) {
                    for (const match of matches) {
                        result.excerpts.push(
                            `${match[1] ? '...' : ''}${match[0]
                                .replace('&nbsp;', ' ')
                                .replace('\n', ' ')}${match[3] ? '...' : ''}`
                        )
                    }
                }
            })

            if (result.excerpts.length) {
                results.push(result)
            }
        })

        const noteFields = ['title', 'body']

        notes.map((note) => {
            const result: SearchResultType = {
                id: note.id,
                label: note.displayName,
                link: `note/${note.id}`,
                excerpts: []
            }

            noteFields.map((field) => {
                const text = (note[field as keyof NoteModel] || '')
                    .toString()
                    .replace('</p>', ' ')
                    .replace(/(<([^>]+)>)/gi, '')
                const matches = [...text.matchAll(regex)]
                if (matches.length) {
                    for (const match of matches) {
                        result.excerpts.push(
                            `${match[1] ? '...' : ''}${match[0]
                                .replace('&nbsp;', ' ')
                                .replace('\n', ' ')}${match[3] ? '...' : ''}`
                        )
                    }
                }
            })

            if (result.excerpts.length) {
                results.push(result)
            }
        })

        const locationFields = ['name', 'body']

        locations.map((location) => {
            const result: SearchResultType = {
                id: location.id,
                label: location.displayName,
                link: `location/${location.id}`,
                excerpts: []
            }

            locationFields.map((field) => {
                const text = (location[field as keyof LocationModel] || '')
                    .toString()
                    .replace('</p>', ' ')
                    .replace(/(<([^>]+)>)/gi, '')
                const matches = [...text.matchAll(regex)]
                if (matches.length) {
                    for (const match of matches) {
                        result.excerpts.push(
                            `${match[1] ? '...' : ''}${match[0]
                                .replace('&nbsp;', ' ')
                                .replace('\n', ' ')}${match[3] ? '...' : ''}`
                        )
                    }
                }
            })

            if (result.excerpts.length) {
                results.push(result)
            }
        })

        const itemFields = ['name', 'body']

        items.map((item) => {
            const result: SearchResultType = {
                id: item.id,
                label: item.displayName,
                link: `item/${item.id}`,
                excerpts: []
            }

            itemFields.map((field) => {
                const text = (item[field as keyof ItemModel] || '')
                    .toString()
                    .replace('</p>', ' ')
                    .replace(/(<([^>]+)>)/gi, '')
                const matches = [...text.matchAll(regex)]
                if (matches.length) {
                    for (const match of matches) {
                        result.excerpts.push(
                            `${match[1] ? '...' : ''}${match[0]
                                .replace('&nbsp;', ' ')
                                .replace('\n', ' ')}${match[3] ? '...' : ''}`
                        )
                    }
                }
            })

            if (result.excerpts.length) {
                results.push(result)
            }
        })

        return results
    }

    async wordCount() {
        const scenes = await this.scenes.fetch()
        return scenes.reduce((count, scene) => count + scene.words, 0)
    }

    async progress() {
        const scenes = await this.scenes.fetch()
        const total = 100 / scenes.filter((scene) => scene.status !== Status.ARCHIVE).length

        const percentages = percentRound(
            [
                total * scenes.filter((scene) => scene.status === Status.TODO).length,
                total * scenes.filter((scene) => scene.status === Status.DRAFT).length,
                total * scenes.filter((scene) => scene.status === Status.REVIEW).length,
                total * scenes.filter((scene) => scene.status === Status.COMPLETE).length
            ].map((percentage) => Math.round(percentage))
        )

        return percentages
    }

    async backup() {
        const character = await this.character.fetch()
        const connection = await this.connection.fetch()
        const item = await this.item.fetch()
        const location = await this.location.fetch()
        const note = await this.note.fetch()
        const section = await this.section.fetch()
        const statistic = await this.statistics.fetch()
        const tag = await this.tags.fetch()

        const backupPath = await this.database.localStorage.get<string>('autoBackupPath')

        const dbData = {
            work: [this],
            character,
            connection,
            item,
            location,
            note,
            section,
            statistic,
            tag
        }

        const images: string[] = []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jsonData: any = {
            work: [],
            character: [],
            connection: [],
            item: [],
            location: [],
            note: [],
            section: [],
            statistic: [],
            tag: []
        }

        Object.entries(dbData).map(([table, items]) => {
            const columns: ColumnName[] = Object.keys(schema.tables[table].columns)
            items.map((item) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any = { id: item.id }

                columns.map((column) => {
                    data[column] = item._getRaw(column)
                })
                jsonData[table].push(data)

                if (columns.includes('image') && item._getRaw('image')) {
                    images.push(item._getRaw('image') as string)
                }
            })
        })

        return { data: jsonData, images: [...new Set(images)], backupPath: backupPath || '' }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @writer async restore(data: any, images: string[]) {
        if (this.image) {
            api.deleteFile(this.image)
        }
        await this.character.destroyAllPermanently()
        await this.connection.destroyAllPermanently()
        await this.item.destroyAllPermanently()
        await this.location.destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await this.section.destroyAllPermanently()

        await this.update((work) => {
            work.title = data.work[0].title
            work.author = data.work[0].author
            work.language = data.work[0].language
            work.summary = data.work[0].summary
            work.wordGoal = Number(data.work[0].word_goal) || null
            work.image = data.work[0].image
            work.deadlineAt = DateTime.fromMillis(data.work[0].deadline_at).toJSDate()
            work.updatedAt = DateTime.fromMillis(data.work[0].updated_at).toJSDate()
        })

        await this.batch(
            ...data.character.map((characterData: any) =>
                this.collections.get<CharacterModel>('character').prepareCreate((character) => {
                    character._raw.id = characterData.id
                    character.work.set(this)
                    character.mode = characterData.mode
                    character.displayName = characterData.display_name
                    character.image = characterData.image
                    character.firstName = characterData.first_name
                    character.lastName = characterData.last_name
                    character.nickname = characterData.nickname
                    character.gender = characterData.gender
                    character.apparentAge = characterData.apparent_age
                    character.placeOfBirth = characterData.place_of_birth
                    character.residence = characterData.residence
                    character.education = characterData.education
                    character.profession = characterData.profession
                    character.finances = characterData.finances
                    character.ethnicity = characterData.ethnicity
                    character.height = characterData.height
                    character.build = characterData.build
                    character.hair = characterData.hair
                    character.face = characterData.face
                    character.distinguishingFeatures = characterData.distinguishing_features
                    character.religion = characterData.religion
                    character.politicalLeaning = characterData.political_leaning
                    character.description = characterData.description
                    character.history = characterData.history
                    character.status = characterData.status
                    character.createdAt = DateTime.fromMillis(characterData.created_at).toJSDate()
                    character.updatedAt = DateTime.fromMillis(characterData.updated_at).toJSDate()
                })
            ),
            ...(data.connection || []).map((connectionData: any) =>
                this.collections.get<ConnectionModel>('connection').prepareCreate((connection) => {
                    connection._raw.id = connectionData.id
                    connection.work.set(this)
                    connection.tableA = connectionData.table_a
                    connection.tableB = connectionData.table_b
                    connection.idA = connectionData.id_a
                    connection.idB = connectionData.id_b
                    connection.to = connectionData.to
                    connection.from = connectionData.from
                    connection.mode = connectionData.mode
                })
            ),
            ...data.item.map((itemData: any) =>
                this.collections.get<ItemModel>('item').prepareCreate((item) => {
                    item._raw.id = itemData.id
                    item.work.set(this)
                    item.name = itemData.name
                    item.body = itemData.body
                    item.status = itemData.status
                    item.createdAt = DateTime.fromMillis(itemData.created_at).toJSDate()
                    item.updatedAt = DateTime.fromMillis(itemData.updated_at).toJSDate()
                })
            )
        )

        await this.batch(
            ...data.location.map((locationData: any) =>
                this.collections.get<LocationModel>('location').prepareCreate((location) => {
                    location._raw.id = locationData.id
                    if (locationData.location_id)
                        location._setRaw('location_id', locationData.location_id)
                    location.work.set(this)
                    location.name = locationData.name
                    location.body = locationData.body
                    location.status = locationData.status
                    location.createdAt = DateTime.fromMillis(locationData.created_at).toJSDate()
                    location.updatedAt = DateTime.fromMillis(locationData.updated_at).toJSDate()
                })
            ),
            ...data.section.map((sectionData: any) =>
                this.collections.get<SectionModel>('section').prepareCreate((section) => {
                    section._raw.id = sectionData.id
                    if (sectionData.section_id)
                        section._setRaw('section_id', sectionData.section_id)
                    if (sectionData.point_of_view_character_id)
                        section._setRaw(
                            'point_of_view_character_id',
                            sectionData.point_of_view_character_id
                        )
                    section.work.set(this)
                    section.pointOfView = sectionData.point_of_view
                    section.status = sectionData.status
                    section.title = sectionData.title
                    section.mode = sectionData.mode
                    section.body = sectionData.body
                    section.description = sectionData.description
                    section.date = sectionData.date
                    section.order = sectionData.order
                    section.wordGoal = sectionData.word_goal
                    section.wordGoalPerDay = sectionData.word_goal_per_day
                    if (sectionData.deadline_at)
                        section.deadlineAt = DateTime.fromMillis(sectionData.deadline_at).toJSDate()
                    section.createdAt = DateTime.fromMillis(sectionData.created_at).toJSDate()
                    section.updatedAt = DateTime.fromMillis(sectionData.updated_at).toJSDate()
                })
            )
        )

        for await (const noteData of data.note) {
            await this.collections
                .get<NoteModel>('note')
                .create((note) => {
                    note._raw.id = noteData.id
                    note.work.set(this)
                    if (noteData.character_id) note._setRaw('character_id', noteData.character_id)
                    if (noteData.item_id) note._setRaw('item_id', noteData.item_id)
                    if (noteData.location_id) note._setRaw('location_id', noteData.location_id)
                    if (noteData.section_id) note._setRaw('section_id', noteData.section_id)
                    if (noteData.note_id) note._setRaw('note_id', noteData.note_id)
                    note.title = noteData.title
                    note.body = noteData.body
                    note.color = noteData.color
                    note.date = noteData.date
                    note.url = noteData.url
                    note.image = noteData.image
                    note.status = noteData.status
                    note.createdAt = DateTime.fromMillis(noteData.created_at).toJSDate()
                    note.updatedAt = DateTime.fromMillis(noteData.updated_at).toJSDate()
                })
                .catch(() => {
                    //
                })
        }

        for await (const statisticData of data.statistic) {
            await this.collections
                .get<StatisticModel>('statistic')
                .create((statistic) => {
                    statistic._raw.id = statisticData.id
                    statistic.work.set(this)
                    statistic._setRaw('section_id', statisticData.section_id)
                    statistic.createdAt = DateTime.fromMillis(statisticData.created_at).toJSDate()
                    statistic.updatedAt = DateTime.fromMillis(statisticData.updated_at).toJSDate()
                })
                .catch(() => {
                    //
                })
        }

        for await (const tagData of data.tag) {
            await this.collections
                .get<TagModel>('tag')
                .create((tag) => {
                    tag._raw.id = tagData.id
                    tag.work.set(this)
                    if (tagData.character_id) tag._setRaw('character_id', tagData.character_id)
                    if (tagData.item_id) tag._setRaw('item_id', tagData.item_id)
                    if (tagData.location_id) tag._setRaw('location_id', tagData.location_id)
                    if (tagData.section_id) tag._setRaw('section_id', tagData.section_id)
                    if (tagData.note_id) tag._setRaw('note_id', tagData.note_id)
                    tag.createdAt = DateTime.fromMillis(tagData.created_at).toJSDate()
                    tag.updatedAt = DateTime.fromMillis(tagData.updated_at).toJSDate()
                })
                .catch(() => {
                    //
                })
        }

        return true
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

    @lazy taggableNotes = this.note.extend(Q.sortBy('title', Q.asc), Q.where('is_taggable', true))

    @lazy statistics = this.collections
        .get<StatisticModel>('statistic')
        .query(
            Q.experimentalNestedJoin('section', 'work'),
            Q.on('section', Q.on('work', 'id', this.id))
        )

    @lazy tags = this.collections
        .get<TagModel>('tag')
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
            note.isTaggable = data.isTaggable
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
        if (this.image) {
            api.deleteFile(this.image)
        }
        await this.character.destroyAllPermanently()
        await this.connection.destroyAllPermanently()
        await this.item.destroyAllPermanently()
        await this.location.destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await this.section.destroyAllPermanently()
        await this.statistic.destroyAllPermanently()
        await this.tag.destroyAllPermanently()
        await this.destroyPermanently()
        return true
    }
}
