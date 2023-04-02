import { capitalize } from '@mui/material/utils'
import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, relation, text, writer, lazy } from '@nozbe/watermelondb/decorators'
import { DateTime, Interval } from 'luxon'
import { type PointOfViewType } from '@sl/constants/pov'
import { SectionMode, type SectionModeType } from '@sl/constants/sectionMode'
import { Status, type StatusType } from '@sl/constants/status'
import { htmlExtractExcerpts, htmlParse, wordCount } from '@sl/utils'
import { type SectionDataType, type StatisticDataType } from './types'
import { CharacterModel, ItemModel, LocationModel, NoteModel, StatisticModel, WorkModel } from './'
export default class SectionModel extends Model {
    static table = 'section'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'section_id' },
        statistic: { type: 'has_many', foreignKey: 'section_id' },
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

    async characters() {
        return await this._tags('character')
    }

    async items() {
        return await this._tags('item')
    }

    async locations() {
        return await this._tags('location')
    }

    get excerpts() {
        return this.body ? htmlExtractExcerpts(this.body) : null
    }

    async _tags(mode: string) {
        const ids: string[] = []

        new DOMParser()
            .parseFromString(this.body, 'text/html')
            .querySelectorAll(`.tag-${mode}`)
            .forEach((tag) => ids.push(tag.id))

        if (ids.length) {
            return await this.database
                .get<CharacterModel | ItemModel | LocationModel>(mode)
                .query(Q.where('id', Q.oneOf(ids)))
                .fetch()
        }

        return []
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @lazy scenes = this.collections
        .get<SectionModel>('section')
        .query(
            Q.where('section_id', this.id),
            Q.where('mode', SectionMode.SCENE),
            Q.sortBy('order', Q.asc)
        )

    @lazy chapters = this.collections
        .get<SectionModel>('section')
        .query(
            Q.where('section_id', this.id),
            Q.where('mode', SectionMode.CHAPTER),
            Q.sortBy('order', Q.asc)
        )

    @lazy versions = this.collections
        .get<SectionModel>('section')
        .query(
            Q.where('section_id', this.id),
            Q.where('mode', SectionMode.VERSION),
            Q.sortBy('order', Q.desc)
        )

    @lazy statistics = this.collections
        .get<StatisticModel>('statistic')
        .query(Q.where('section_id', this.id), Q.sortBy('created_at', Q.desc))

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
            this.wordCount = wordCount(this.body)
        } else if (this.isChapter) {
            const scenes = await this.scenes.fetch()
            this.wordCount = scenes.reduce((count, scene) => count + wordCount(scene.body), 0)
        } else {
            const chapters = await this.chapters.fetch()
            let count = 0
            for await (const chapter of chapters) {
                const scenes = await chapter.scenes.fetch()
                count += scenes.reduce((count, scene) => count + wordCount(scene.body), 0)
            }
            this.wordCount = count
        }
        return this.wordCount
    }

    get daysRemaining(): number | undefined {
        if (!this.deadlineAt) return undefined

        const now = DateTime.now()
        const deadline = DateTime.fromJSDate(this.deadlineAt)

        if (now.toMillis() > deadline.toMillis()) return 0

        const diff = Interval.fromDateTimes(now, deadline)
        return Math.ceil(diff.length('days'))
    }

    get wordsPerDay(): number | undefined {
        if (!this.wordGoal || this.daysRemaining === undefined) return undefined
        else if (!this.daysRemaining) return this.wordGoal - this.wordCount

        return this.wordCount < this.wordGoal
            ? Math.ceil((this.wordGoal - this.wordCount) / this.daysRemaining)
            : 0
    }

    async destroyPermanently(): Promise<void> {
        if (this.isChapter) {
            const sceneCount = await this.scenes.fetchCount()
            if (sceneCount) return
        } else if (this.isPart) {
            const chapterCount = await this.chapters.fetchCount()
            if (chapterCount) return
        }

        this.note.destroyAllPermanently()
        this.statistic.destroyAllPermanently()
        return super.destroyPermanently()
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
        return await this.collections.get<StatisticModel>('statistic').create((statistic) => {
            statistic.section.set(this)
            statistic.words = Number(data)
        })
    }

    @writer async updateSection(data: SectionDataType) {
        await this.update((section) => {
            section.title = data.title
            section.description = data.description
            section.date = data.date
            section.order = Number(data.order)
            section.wordGoal = Number(data.wordGoal)
            section.deadlineAt = data.deadlineAt
            section.pointOfView = data.pointOfView
        })
    }

    @writer async updatePoVCharacter(character: CharacterModel | null) {
        await this.update((section) => {
            section.pointOfViewCharacter.set(character)
        })
    }

    @writer async updateBody(data: string) {
        await this.update((section) => {
            section.body = data
        })
    }

    @writer async updateOrder(data: number) {
        await this.update((section) => {
            section.order = data
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((section) => {
            section.status = status
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
