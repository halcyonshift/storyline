import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, readonly, relation } from '@nozbe/watermelondb/decorators'

import SectionModel from './SectionModel'

export default class StatisticModel extends Model {
    static table = 'statistic'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        section: { type: 'belongs_to', key: 'section_id' }
    }

    @field('words') words!: number
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('section', 'section_id') section!: Relation<SectionModel>
}
