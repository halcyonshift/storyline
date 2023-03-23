import { capitalize } from '@mui/material/utils'
import { Model, Q, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, readonly, relation, text, writer, lazy } from '@nozbe/watermelondb/decorators'
import { DateTime } from 'luxon'
import { Status, type StatusType } from '@sl/constants/status'
import { type PointOfViewType } from '@sl/constants/pov'
import { htmlExtractExcerpts, htmlParse } from '@sl/utils'
import { type SectionDataType, type StatisticDataType } from './types'
import { CharacterModel, ItemModel, LocationModel, StatisticModel, WorkModel } from './'
import { SectionMode, type SectionModeType } from '@sl/constants/sectionMode'

export default class SectionModel extends Model {
    static table = 'section'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        section: { type: 'belongs_to', key: 'section_id' },
        pov_character: { type: 'belongs_to', key: 'pov_character_id' }
    }
    @field('status') status!: StatusType
    @field('pov') pointOfView!: PointOfViewType
    @text('title') title!: string
    @field('mode') mode!: SectionModeType
    @text('body') body!: string
    @text('description') description!: string
    @text('date') date!: string
    @field('order') order!: number
    @field('word_goal') wordGoal!: number
    @date('deadline_at') deadlineAt!: Date
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('work', 'work_id') work!: Relation<WorkModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('character', 'pov_character_id') pointOfViewCharacter!: Relation<CharacterModel>

    sortDate: number

    get displayTitle() {
        const title =
            this.title || `${capitalize(SectionMode[this.mode].toLowerCase())} ${this.order}`

        if (this.isVersion) {
            return this.title ? `${this.title} (${this.order})` : title
        }

        return title
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

    async getSortDate() {
        let date: string | DateTime = this.date

        if (!date) {
            if (this.isScene) {
                const chapter = await this.section.fetch()

                if (!chapter.date) {
                    const part = await chapter.section.fetch()
                    date = part.date
                } else {
                    date = chapter.date
                }
            } else if (this.isChapter) {
                const part = await this.section.fetch()
                date = part.date
            }
        }

        date = DateTime.fromSQL(date)
        this.sortDate = date.isValid ? date.toSeconds() : 0
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

    @writer async delete() {
        if (this.isScene) {
            await this.destroyPermanently()
        } else if (this.isChapter) {
            const sceneCount = await this.scenes.fetchCount()
            if (!sceneCount) await this.destroyPermanently()
        } else if (this.isPart) {
            const chapterCount = await this.chapters.fetchCount()
            if (!chapterCount) await this.destroyPermanently()
        }

        return true
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
            statistic.words = data.words
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
            section.pointOfViewCharacter.set(data.pointOfViewCharacter)
            section.pointOfView = data.pointOfView
        })
    }

    @writer async updateBody(data: string) {
        await this.update((section) => {
            section.body = data
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((section) => {
            section.status = status
        })
    }
}
