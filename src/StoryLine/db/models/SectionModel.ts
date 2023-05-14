import { capitalize } from '@mui/material/utils'
import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, relation, text, writer, lazy } from '@nozbe/watermelondb/decorators'
import { DateTime, Interval } from 'luxon'
import { type PointOfViewType } from '@sl/constants/pov'
import { SectionMode, type SectionModeType } from '@sl/constants/sectionMode'
import { Status, type StatusType } from '@sl/constants/status'
import {
    displayDate,
    displayTime,
    displayDateTime,
    sortDate,
    htmlExtractExcerpts,
    htmlParse,
    wordCount
} from '@sl/utils'
import { stripSlashes } from '@sl/components/RichtextEditor/plugins/Tag/utils'
import { type AllTagsType, type SectionDataType, type StatisticDataType } from './types'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    StatisticModel,
    TagModel,
    WorkModel
} from './'
import { Fragment } from 'react'
export default class SectionModel extends Model {
    static table = 'section'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'section_id' },
        statistic: { type: 'has_many', foreignKey: 'section_id' },
        tag: { type: 'has_many', foreignKey: 'section_id' },
        section: { type: 'belongs_to', key: 'section_id' },
        point_of_view_character: { type: 'belongs_to', key: 'point_of_view_character_id' }
    }
    @field('status') status!: StatusType
    @field('point_of_view') pointOfView!: PointOfViewType
    @text('title') title!: string
    @field('mode') mode!: SectionModeType
    @text('body') body!: string
    @text('description') description!: string
    @text('date') date!: string
    @field('order') order!: number
    @field('words') words!: number
    @field('word_goal') wordGoal!: number
    @field('word_goal_per_day') wordGoalPerDay!: number
    @date('deadline_at') deadlineAt!: Date
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('character', 'point_of_view_character_id')
    pointOfViewCharacter!: Relation<CharacterModel>
    @children('note') note!: Query<NoteModel>
    @children('statistic') statistic!: Query<StatisticModel>
    @children('tag') tag!: Query<TagModel>

    wordCount = 0

    get displayTitle() {
        const title =
            this.title || `${capitalize(SectionMode[this.mode].toLowerCase())} ${this.order}`

        if (this.isVersion) {
            return this.title ? `${this.title} (${this.order})` : title
        }

        return title
    }

    get displayName() {
        return this.displayTitle
    }

    get displayBody() {
        return this.body ? htmlParse(this.body) : null
    }

    get displayDescription() {
        return this.description ? htmlParse(this.description) : null
    }

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

    get isChapter() {
        return Boolean(this.mode === SectionMode.CHAPTER)
    }

    get isScene() {
        return Boolean(this.mode === SectionMode.SCENE)
    }

    get isPart() {
        return Boolean(this.mode === SectionMode.PART)
    }

    get isVersion() {
        return Boolean(this.mode === SectionMode.VERSION)
    }

    get excerpts() {
        return this.body ? htmlExtractExcerpts(this.body) : null
    }

    async isTagged(id: string) {
        const tags = await this.tag.fetch()
        return Boolean(
            tags.find((tag) =>
                [tag.character.id, tag.item.id, tag.location.id, tag.note.id].includes(id)
            ) || this.body.includes(id)
        )
    }

    async taggedCharacters(id?: string) {
        return await this._allTags('character', 'display_name', id)
    }

    async taggedItems(id?: string) {
        return await this._allTags('item', 'name', id)
    }

    async taggedLocations(id?: string) {
        return await this._allTags('location', 'name', id)
    }

    async taggedNotes(id?: string) {
        return await this._allTags('note', 'order', id)
    }

    async _allTags(
        mode: 'character' | 'item' | 'location' | 'note',
        sort: string,
        id: string
    ): Promise<AllTagsType[]> {
        const tags = await this.tag.extend(Q.where(`${mode}_id`, Q.notEq('')))
        const textTags = await this._textTags(mode)
        const ids = textTags
            .map((data) => data.id)
            .concat(tags.map((tag) => tag[mode].id))
            .filter((id) => id)

        if (id && !ids.includes(id)) return []

        const data = await this.collections
            .get<CharacterModel | ItemModel | LocationModel | NoteModel>(mode)
            .query(Q.where('id', Q.oneOf(ids)), Q.sortBy(sort, Q.asc))

        return data.map((record) => ({
            record,
            text: textTags.filter((tag) => tag.id === record.id).map((tag) => tag.text)
        }))
    }

    async _textTags(mode: 'character' | 'item' | 'location' | 'note') {
        const data: { id: string; mode: string; text: string }[] = []
        new DOMParser()
            .parseFromString(this.body, 'text/html')
            .querySelectorAll(`.tag-${mode}`)
            .forEach((tag: HTMLAnchorElement) => {
                const url = new URL(tag.href)
                data.push({
                    id: stripSlashes(url.pathname).split('/')[1],
                    mode,
                    text: tag.textContent
                })
            })
        return data
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @lazy sections = this.collections
        .get<SectionModel>('section')
        .query(Q.where('section_id', this.id), Q.sortBy('order', Q.asc))

    @lazy scenes = this.sections.extend(Q.where('mode', SectionMode.SCENE))
    @lazy chapters = this.sections.extend(Q.where('mode', SectionMode.CHAPTER))
    @lazy versions = this.sections.extend(Q.where('mode', SectionMode.VERSION))

    @lazy statistics = this.collections
        .get<StatisticModel>('statistic')
        .query(Q.where('section_id', this.id), Q.sortBy('created_at', Q.desc))

    @lazy characterTags = this.tag.extend(Q.where('character_id', Q.notEq(null)))
    @lazy itemTags = this.tag.extend(Q.where('item_id', Q.notEq(null)))
    @lazy locationTags = this.tag.extend(Q.where('location_id', Q.notEq(null)))
    @lazy noteTags = this.tag.extend(Q.where('note_id', Q.notEq(null)))

    async addVersion() {
        const count = await this.versions.fetchCount()
        return await this.addSection({
            mode: SectionMode.VERSION,
            pointOfView: this.pointOfView,
            order: count + 1,
            title: this.title,
            description: this.description,
            body: this.body,
            date: this.date,
            wordGoal: this.wordGoal,
            deadlineAt: this.deadlineAt,
            status: this.status
        })
    }

    async addChapter() {
        const count = await this.chapters.fetchCount()
        return await this.addSection({
            mode: SectionMode.CHAPTER,
            order: count + 1
        })
    }

    async addScene() {
        const count = await this.scenes.fetchCount()
        return await this.addSection({
            mode: SectionMode.SCENE,
            order: count + 1
        })
    }

    async getWordCount(): Promise<number> {
        if (this.isScene || this.isVersion) {
            this.wordCount = this.words
        } else if (this.isChapter) {
            const scenes = await this.scenes.fetch()
            this.wordCount = scenes.reduce((count, scene) => count + scene.words, 0)
        } else {
            const chapters = await this.chapters.fetch()
            let count = 0
            for await (const chapter of chapters) {
                const scenes = await chapter.scenes.fetch()
                count += scenes.reduce((count, scene) => count + scene.words, 0)
            }
            this.wordCount = count
        }
        return this.wordCount
    }

    async destroyPermanently(): Promise<void> {
        this.note.destroyAllPermanently()
        this.statistic.destroyAllPermanently()
        this.tag.destroyAllPermanently()
        this.versions.destroyAllPermanently()
        return super.destroyPermanently()
    }

    get daysRemaining(): number | null {
        if (!this.deadlineAt) return null

        const now = DateTime.now()
        const deadline = DateTime.fromJSDate(this.deadlineAt)

        if (now.toMillis() > deadline.toMillis()) return 0

        const diff = Interval.fromDateTimes(now, deadline)
        return Math.ceil(diff.length('days'))
    }

    get wordsPerDay(): number | null {
        if (!this.wordGoal || this.daysRemaining === null) return null
        else if (!this.daysRemaining) return this.wordGoal - this.wordCount

        return this.wordCount < this.wordGoal
            ? Math.ceil((this.wordGoal - this.wordCount) / this.daysRemaining)
            : 0
    }

    @writer async addSection(data: SectionDataType) {
        const work = await this.work.fetch()
        return await this.collections.get<SectionModel>('section').create((section) => {
            section.section.set(this)
            section.work.set(work)
            section.title = (data.title || '').toString()
            section.description = (data.description || '').toString()
            section.body = (data.body || '').toString()
            section.date = data.date
            section.order = data.order
            section.wordGoal = data.wordGoal
            section.mode = data.mode
            section.deadlineAt = data.deadlineAt
            section.status = Status.TODO
        })
    }

    @writer async addStatistic(data: StatisticDataType) {
        const work = await this.work.fetch()
        return await this.collections.get<StatisticModel>('statistic').create((statistic) => {
            statistic.work.set(work)
            statistic.section.set(this)
            statistic.words = Number(data)
        })
    }

    @writer async updateRecord(
        data: Partial<SectionDataType>,
        tags?: {
            characters: CharacterModel[]
            items: ItemModel[]
            locations: LocationModel[]
            notes: NoteModel[]
        }
    ) {
        await this.update((section) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(section as any)[key] = value
            }
        })

        if (tags) {
            const work = await this.work.fetch()
            await this.tag.destroyAllPermanently()
            await this.batch(
                ...tags.characters.map((character) =>
                    this.collections.get<TagModel>('tag').prepareCreate((tag) => {
                        tag.work.set(work)
                        tag.section.set(this)
                        tag.character.set(character)
                    })
                ),
                ...tags.items.map((item) =>
                    this.collections.get<TagModel>('tag').prepareCreate((tag) => {
                        tag.work.set(work)
                        tag.section.set(this)
                        tag.item.set(item)
                    })
                ),
                ...tags.locations.map((location) =>
                    this.collections.get<TagModel>('tag').prepareCreate((tag) => {
                        tag.work.set(work)
                        tag.section.set(this)
                        tag.location.set(location)
                    })
                ),
                ...tags.notes.map((note) =>
                    this.collections.get<TagModel>('tag').prepareCreate((tag) => {
                        tag.work.set(work)
                        tag.section.set(this)
                        tag.note.set(note)
                    })
                )
            )
        }
    }

    @writer async updatePoVCharacter(character: CharacterModel | null) {
        await this.update((section) => {
            section.pointOfViewCharacter.set(character)
        })
    }

    @writer async updateBody(data: string) {
        await this.update((section) => {
            section.body = data
            section.words = wordCount(data)
        })
    }

    @writer async delete() {
        if (this.isChapter) {
            const sceneCount = await this.scenes.fetchCount()
            if (sceneCount) return
        } else if (this.isPart) {
            const chapterCount = await this.chapters.fetchCount()
            if (chapterCount) return
        }

        await this.destroyPermanently()
        return true
    }
}
