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
import { displayDateTime } from '@sl/utils'
import { t } from 'i18next'
import {
    CharacterDataType,
    ConnectionDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType,
    SprintDataType,
    WorkDataType
} from './types'
import {
    CharacterModel,
    ConnectionModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    SprintModel,
    SprintStatisticModel,
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
        sprint: { type: 'has_many', foreignKey: 'work_id' },
        sprint_statistic: { type: 'has_many', foreignKey: 'work_id' },
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
    @children('sprint') sprint!: Query<SprintModel>
    @children('sprint_statistic') sprint_statistic!: Query<SprintStatisticModel>
    @children('statistic') statistic!: Query<StatisticModel>
    @children('tag') tag!: Query<StatisticModel>

    get displayDeadline() {
        return displayDateTime(this.deadlineAt)
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

    wordsPerDay(currentWords = 0): null | number {
        if (!this.wordGoal) return null
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
        const sprint = await this.sprint.fetch()
        const sprint_statistic = await this.sprint_statistic.fetch()
        const statistic = await this.statistic.fetch()
        const tag = await this.tag.fetch()

        const backupPath = await this.database.localStorage.get<string>('autoBackupPath')

        const dbData = {
            work: [this],
            character,
            connection,
            item,
            location,
            note,
            section,
            sprint,
            sprint_statistic,
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
            sprint: [],
            sprint_statistic: [],
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

    @writer async restore(data: any) {
        await this.update((work) => {
            work.title = data.work[0].title
            work.author = data.work[0].author
            work.language = data.work[0].language
            work.summary = data.work[0].summary
            work.wordGoal = Number(data.work[0].word_goal) || null
            work.image = data.work[0].image
            work.deadlineAt = DateTime.fromMillis(data.work[0].deadline_at).toJSDate()
            work.createdAt = DateTime.fromMillis(data.work[0].created_at).toJSDate()
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
            ),
            ...data.sprint.map((sprintData: any) =>
                this.collections.get<SprintModel>('sprint').prepareCreate((sprint) => {
                    sprint._raw.id = sprintData.id
                    sprint.work.set(this)
                    sprint.startAt = DateTime.fromMillis(sprintData.start_at).toJSDate()
                    sprint.endAt = DateTime.fromMillis(sprintData.end_at).toJSDate()
                    sprint.wordGoal = sprintData.word_goal
                    sprint.createdAt = DateTime.fromMillis(sprintData.created_at).toJSDate()
                    sprint.updatedAt = DateTime.fromMillis(sprintData.updated_at).toJSDate()
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
                    note.isTaggable = noteData.is_taggable
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
                    statistic.words = statisticData.words
                    statistic.createdAt = DateTime.fromMillis(statisticData.created_at).toJSDate()
                    statistic.updatedAt = DateTime.fromMillis(statisticData.updated_at).toJSDate()
                })
                .catch(() => {
                    //
                })
        }

        for await (const statisticData of data.sprint_statistic) {
            await this.collections
                .get<SprintStatisticModel>('sprint_statistic')
                .create((statistic) => {
                    statistic._raw.id = statisticData.id
                    statistic.work.set(this)
                    statistic._setRaw('sprint_id', statisticData.sprint_id)
                    statistic._setRaw('section_id', statisticData.section_id)
                    statistic.words = statisticData.words
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

    @lazy sections = this.section.extend(Q.sortBy('order', Q.asc))
    @lazy parts = this.sections.extend(Q.where('mode', SectionMode.PART))
    @lazy chapters = this.sections.extend(Q.where('mode', SectionMode.CHAPTER))
    @lazy scenes = this.sections.extend(Q.where('mode', SectionMode.SCENE))

    @lazy characters = this.character.extend(Q.sortBy('display_name', Q.asc))
    @lazy primaryCharacters = this.characters.extend(Q.where('mode', CharacterMode.PRIMARY))
    @lazy secondaryCharacters = this.characters.extend(Q.where('mode', CharacterMode.SECONDARY))
    @lazy tertiaryCharacters = this.characters.extend(Q.where('mode', CharacterMode.TERTIARY))

    @lazy items = this.item.extend(Q.sortBy('name', Q.asc))

    @lazy locations = this.location.extend(Q.sortBy('name', Q.asc))

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))
    @lazy taggableNotes = this.note.extend(Q.sortBy('title', Q.asc), Q.where('is_taggable', true))

    @lazy statistics = this.collections
        .get<StatisticModel>('statistic')
        .query(
            Q.experimentalNestedJoin('section', 'work'),
            Q.on('section', [Q.on('work', 'id', this.id), Q.where('mode', 'SCENE')])
        )

    @lazy tags = this.collections
        .get<TagModel>('tag')
        .query(
            Q.experimentalNestedJoin('section', 'work'),
            Q.on('section', Q.on('work', 'id', this.id))
        )

    @writer async updateRecord(data: Partial<WorkDataType>) {
        await this.update((work) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(work as any)[key] = value
            }
        })
    }

    @writer async addCharacter(mode: CharacterModeType, data: Partial<CharacterDataType>) {
        return await this.collections.get<CharacterModel>('character').create((character) => {
            character.work.set(this)
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(character as any)[key] = value
            }
            character.mode = mode
            character.status = Status.TODO
        })
    }

    @writer async addConnection(data: Partial<ConnectionDataType>) {
        return await this.collections.get<ConnectionModel>('connection').create((connection) => {
            connection.work.set(this)
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(connection as any)[key] = value
            }
        })
    }

    @writer async addItem(data: Partial<ItemDataType>) {
        return await this.collections.get<ItemModel>('item').create((item) => {
            item.work.set(this)
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(item as any)[key] = value
            }
            item.status = Status.TODO
        })
    }

    @writer async addNote(data: Partial<NoteDataType>) {
        return await this.collections.get<NoteModel>('note').create((note) => {
            note.work.set(this)
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(note as any)[key] = value
            }
            note.status = Status.TODO
        })
    }

    @writer async addLocation(data: Partial<LocationDataType>) {
        return await this.collections.get<LocationModel>('location').create((location) => {
            location.work.set(this)
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(location as any)[key] = value
            }
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

    @writer async addSprint(data: Partial<SprintDataType>) {
        return await this.collections.get<SprintModel>('sprint').create((sprint) => {
            sprint.work.set(this)
            sprint.wordGoal = data.wordGoal
            sprint.startAt = data.startAt
            sprint.endAt = data.endAt
        })
    }

    @writer async delete() {
        api.deleteFile(this.image)
        await this.character.destroyAllPermanently()
        await this.connection.destroyAllPermanently()
        await this.item.destroyAllPermanently()
        await this.location.destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await this.section.destroyAllPermanently()
        await this.sprint.destroyAllPermanently()
        await this.sprint_statistic.destroyAllPermanently()
        await this.statistic.destroyAllPermanently()
        await this.tag.destroyAllPermanently()
        return true
    }
}
