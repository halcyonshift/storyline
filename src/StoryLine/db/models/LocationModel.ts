import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { LatLngExpression } from 'leaflet'
import { Status, type StatusType } from '@sl/constants/status'
import { LocationDataType } from './types'
import ConnectionModel from './ConnectionModel'
import NoteModel from './NoteModel'
import WorkModel from './WorkModel'

export default class LocationModel extends Model {
    static table = 'location'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'character_id' },
        location: { type: 'has_many', foreignKey: 'location_id' }
    }
    @field('status') status!: StatusType
    @text('name') name!: string
    @text('body') body!: string
    @text('latitude') latitude!: string
    @text('longitude') longitude!: string
    @text('url') url!: string
    @field('image') image!: string
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @children('note') note!: Query<NoteModel>
    @children('location') locations!: Query<LocationModel>

    level: number

    get displayName() {
        return this.name
    }

    get latLng(): LatLngExpression | null {
        if (this.latitude && this.longitude) {
            return [parseFloat(this.latitude), parseFloat(this.longitude)]
        }
        return null
    }

    async destroyPermanently(): Promise<void> {
        const countChildren = await this.locations.fetchCount()
        if (countChildren) return

        const connections = await this.collections
            .get<ConnectionModel>('connection')
            .query(Q.or(Q.where('id_a', this.id), Q.where('id_b', this.id)))
        connections.map((connection) => connection.delete())

        if (this.image) {
            api.deleteFile(this.image)
        }
        await this.note.destroyAllPermanently()
        return super.destroyPermanently()
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @writer async addLocation(data: LocationDataType) {
        const work = await this.work.fetch()
        return await this.collections.get<LocationModel>('location').create((location) => {
            location.location.set(this)
            location.work.set(work)
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude
            location.longitude = data.longitude
            location.url = data.url
            location.image = data.image
            location.status = Status.TODO
        })
    }

    @writer async updateLocation(data: LocationDataType) {
        await this.update((location) => {
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude
            location.longitude = data.longitude
            location.url = data.url
            location.image = data.image
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((location) => {
            location.status = status
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
