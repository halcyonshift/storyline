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
import { LatLngExpression } from 'leaflet'
import { LocationDataType } from './types'

import NoteModel from './NoteModel'
import WorkModel from './WorkModel'

export default class LocationModel extends Model {
    static table = 'location'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
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

    @relation('work', 'work_id') work!: Relation<WorkModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @children('note') note!: Query<NoteModel>

    @writer async addLocation(data: LocationDataType) {
        const work = await this.work.fetch()
        // eslint-disable-next-line max-statements
        return await this.collections.get<LocationModel>('location').create((location) => {
            location.location.set(this)
            location.work.set(work)
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

    get latLng(): LatLngExpression | null {
        if (this.latitude && this.longitude) {
            return [parseFloat(this.latitude), parseFloat(this.longitude)]
        }
        return null
    }
}
