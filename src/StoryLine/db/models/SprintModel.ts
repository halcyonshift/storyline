import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, relation, writer } from '@nozbe/watermelondb/decorators'
import { SprintDataType, SprintStatisticDataType } from './types'
import { SprintStatisticModel, WorkModel } from '.'

export default class SprintModel extends Model {
    static table = 'sprint'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        sprint_statistic: { type: 'has_many', foreignKey: 'sprint_id' }
    }

    @field('word_goal') wordGoal!: number
    @date('start_at') startAt!: Date
    @date('end_at') endAt!: Date
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('sprint_statistic') sprint_statistic!: Query<SprintStatisticModel>

    async wordCount(): Promise<number> {
        const stats = await this.sprint_statistic.fetch()
        return stats.reduce((count, stat) => count + (stat.words - stat.wordsStart), 0)
    }

    async destroyPermanently(): Promise<void> {
        this.sprint_statistic.destroyAllPermanently()
        return super.destroyPermanently()
    }

    @writer async updateRecord(data: Partial<SprintDataType>) {
        await this.update((sprint) => {
            sprint.endAt = data.endAt
        })
    }

    @writer async addStatistic(data: SprintStatisticDataType) {
        const work = await this.work.fetch()
        return await this.collections
            .get<SprintStatisticModel>('sprint_statistic')
            .create((statistic) => {
                statistic.sprint.set(this)
                statistic.work.set(work)
                statistic.section.set(data.section)
                statistic.words = Number(data.words)
                statistic.wordsStart = Number(data.wordsStart)
            })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
