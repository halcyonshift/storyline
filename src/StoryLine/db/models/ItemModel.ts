/** @format */

import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators'

import NoteModel from './NoteModel'
import ProjectModel from './ProjectModel'

export default class ItemModel extends Model {
    static table = 'item'
    public static associations: Associations = {
        project: { type: 'belongs_to', key: 'project_id' },
        note: { type: 'has_many', foreignKey: 'character_id' }
    }

    @text('name') name!: string
    @text('body') body!: string
    @text('url') url!: string
    @field('image') image!: string
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('project', 'project_id') project!: Relation<ProjectModel>
    @children('note') note!: Query<NoteModel>

    get displayName() {
        return this.name
    }
}
