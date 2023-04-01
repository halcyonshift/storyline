import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, relation, writer } from '@nozbe/watermelondb/decorators'
import { DateTime } from 'luxon'
import SectionModel from './SectionModel'

export default class StatisticModel extends Model {
    static table = 'statistic'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        section: { type: 'belongs_to', key: 'section_id' }
    }

    @field('words') words!: number
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('section', 'section_id') section!: Relation<SectionModel>

    get isToday(): boolean {
        return Boolean(
            DateTime.fromJSDate(this.createdAt).toFormat('yyyy-MM-dd') ===
                DateTime.now().toFormat('yyyy-MM-dd')
        )
    }

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
