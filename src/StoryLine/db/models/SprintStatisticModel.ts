import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, relation, writer } from '@nozbe/watermelondb/decorators'
import { SectionModel, SprintModel, WorkModel } from '.'

export default class SprintStatisticModel extends Model {
    static table = 'sprint_statistic'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        sprint: { type: 'belongs_to', key: 'sprint_id' },
        section: { type: 'belongs_to', key: 'section_id' }
    }

    @field('words') words!: number
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('sprint', 'sprint_id') sprint!: Relation<SprintModel>
    @relation('work', 'work_id') work!: Relation<WorkModel>

    @writer async updateWords(words: number) {
        await this.update((statistic) => {
            statistic.words = Number(words)
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
