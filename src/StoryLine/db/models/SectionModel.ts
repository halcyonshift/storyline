/** @format */

import { capitalize } from '@mui/material/utils'
import { Model, Q, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, readonly, relation, text, writer, lazy } from '@nozbe/watermelondb/decorators'
import { DateTime } from 'luxon'

import { htmlExtractExcerpts, htmlParse, wordCount } from '../../utils'
import { SectionDataType, StatisticDataType } from './types'
import { CharacterModel, ItemModel, LocationModel, WorkModel } from './'

export default class SectionModel extends Model {
    static table = 'section'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        section: { type: 'belongs_to', key: 'section_id' }
    }

    @text('title') title!: string
    @field('mode') mode!: 'chapter' | 'scene' | 'part' | 'revision'
    @text('body') body!: string
    @text('description') description!: string
    @text('date') date!: string
    @field('words') words!: number
    @field('order') order!: number
    @date('deadline_at') deadlineAt!: Date
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('work', 'work_id') work!: Relation<WorkModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>

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
        return this.date ? DateTime.fromISO(this.date).toFormat('EEEE dd LLL yyyy') : null
    }

    get displayTime() {
        return this.date ? DateTime.fromISO(this.date).toFormat('H:mm') : null
    }

    get displayDateTime() {
        return this.date ? DateTime.fromISO(this.date).toFormat('EEEE dd LLL yyyy H:mm') : null
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
            Q.sortBy('order', Q.asc)
        )

    @writer async addSection(data: SectionDataType) {
        const work = await this.work.fetch()
        // eslint-disable-next-line max-statements
        return await this.collections.get<SectionModel>('section').create((section) => {
            section.section.set(this)
            section.work.set(work)
            section.title = (data.title || '').toString()
            section.description = (data.description || '').toString()
            section.body = (data.body || '').toString()
            section.date = data.date
            section.order = data.order
            section.words = data.words
            section.mode = data.mode
            section.deadlineAt = data.deadlineAt
        })
    }

    @writer async addStatistic(data: StatisticDataType) {
        return await this.collections.get<SectionModel>('section').create((section) => {
            section.section.set(this)
            section.words = data.words
        })
    }

    @writer async updateTitle(data: string) {
        await this.update((section) => {
            section.title = data.toString()
        })
    }

    @writer async updateDate(data: string) {
        await this.update((section) => {
            section.date = data
        })
    }

    @writer async updateBody(data: string) {
        await this.update((section) => {
            section.body = data.toString()
            section.words = wordCount(data.toString())
        })
    }

    @writer async updateDescription(data: string) {
        await this.update((section) => {
            section.description = data.toString()
        })
    }

    @writer async updateOrder(data: number) {
        await this.update((section) => {
            section.order = data
        })
    }

    @writer async setPart(part: SectionModel) {
        await this.update((section) => {
            section.section.set(part)
        })
    }
    // eslint-disable-next-line max-lines
}
