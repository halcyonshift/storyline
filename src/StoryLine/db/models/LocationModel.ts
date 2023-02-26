import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import {
    children,
    date,
    field,
    readonly,
    relation,
    text,
    writer
} from '@nozbe/watermelondb/decorators'

import { LocationDataType } from './types'

import NoteModel from './NoteModel'
import ProjectModel from './ProjectModel'

export default class LocationModel extends Model {
    static table = 'location'
    public static associations: Associations = {
        project: { type: 'belongs_to', key: 'project_id' },
        note: { type: 'has_many', foreignKey: 'character_id' }
    }

    @text('name') name!: string
    @text('body') body!: string
    @text('latitude') latitude!: string
    @text('longitude') longitude!: string
    @text('url') url!: string
    @field('image') image!: string
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @relation('project', 'project_id') project!: Relation<ProjectModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @children('note') note!: Query<NoteModel>

    @writer async addLocation(data: LocationDataType) {
        const project = await this.project.fetch()
        // eslint-disable-next-line max-statements
        return await this.collections.get<LocationModel>('location').create(location => {
            location.location.set(this)
            location.project.set(project)
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude
            location.longitude = data.longitude
            location.url = data.url
            location.image = data.image
        })
    }

    get displayName() {
        return this.name
    }
}