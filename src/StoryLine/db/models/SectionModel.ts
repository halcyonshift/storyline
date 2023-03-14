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
    @field('mode') mode!: 'chapter' | 'scene' | 'part' | 'revision'
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

    get displayTitle() {
        if (this.mode === 'revision') {
            return this.id
        }

        return this.title || `${capitalize(this.mode)} ${this.order}`
    }

    get displayBody() {
        return this.body ? htmlParse(this.body) : null
    }

    get displayDescription() {
        return this.description ? htmlParse(this.description) : null
    }

    get displayDate() {
        try {
            return DateTime.fromISO(this.date).toFormat('EEEE dd LLL yyyy')
        } catch {
            return this.date
        }
    }

    get displayTime() {
        try {
            return DateTime.fromISO(this.date).toFormat('H:mm')
        } catch {
            return this.date
        }
    }

    get displayDateTime() {
        try {
            return DateTime.fromISO(this.date).toFormat('EEEE dd LLL yyyy H:mm')
        } catch {
            return this.date
        }
    }

    get isChapter() {
        return Boolean(this.mode === 'chapter')
    }

    get isScene() {
        return Boolean(this.mode === 'scene')
    }

    get isPart() {
        return Boolean(this.mode === 'part')
    }

    get isRevision() {
        return Boolean(this.mode === 'revision')
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
        .query(Q.where('section_id', this.id), Q.where('mode', 'scene'), Q.sortBy('order', Q.asc))

    @lazy chapters = this.collections
        .get<SectionModel>('section')
        .query(Q.where('section_id', this.id), Q.where('mode', 'chapter'), Q.sortBy('order', Q.asc))

    @lazy revisions = this.collections
        .get<SectionModel>('section')
        .query(
            Q.where('section_id', this.id),
            Q.where('mode', 'revision'),
            Q.sortBy('order', Q.desc)
        )

    async addRevision() {
        const count = await this.revisions.fetchCount()
        return await this.addSection({
            mode: 'revision',
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
            mode: 'chapter',
            order: count + 1
        })
    }

    async addScene() {
        const count = await this.scenes.fetchCount()
        return await this.addSection({
            mode: 'scene',
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
            section.order = data.order
            section.wordGoal = data.wordGoal
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
