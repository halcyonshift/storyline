import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { children, date, lazy, field, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { Status, type StatusType } from '@sl/constants/status'
import { displayDate, displayTime, displayDateTime, sortDate } from '@sl/utils'
import { NoteDataType } from './types'
import { CharacterModel, ItemModel, LocationModel, SectionModel, TagModel, WorkModel } from '.'
import { BreadcrumbType, TabType } from '@sl/layouts/Work/types'

export default class NoteModel extends Model {
    static table = 'note'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        character: { type: 'belongs_to', key: 'character_id' },
        item: { type: 'belongs_to', key: 'item_id' },
        location: { type: 'belongs_to', key: 'location_id' },
        note: { type: 'belongs_to', key: 'note_id' },
        section: { type: 'belongs_to', key: 'section_id' },
        tag: { type: 'has_many', foreignKey: 'tag_id' }
    }
    @field('status') status!: StatusType
    @text('title') title!: string
    @text('body') body!: string
    @text('date') date!: string
    @text('url') url!: string
    @field('image') image!: string
    @text('color') color!: string
    @field('order') order!: number
    @field('is_taggable') isTaggable!: boolean
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('character', 'character_id') character!: Relation<CharacterModel>
    @relation('item', 'item_id') item!: Relation<ItemModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @relation('note', 'note_id') note!: Relation<NoteModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('tag') tag!: Query<TagModel>

    level: number

    get displayName() {
        return this.title
    }

    get sortDate() {
        return sortDate(this.date)
    }

    get displayDate() {
        return displayDate(this.date)
    }

    get displayTime() {
        return displayTime(this.date)
    }

    get displayDateTime() {
        return displayDateTime(this.date)
    }

    async getBreadcrumbs(includeSelf = true): Promise<BreadcrumbType[]> {
        const work = await this.work.fetch()
        const notes = await work.note.fetch()

        const ancestors = []
        let parent = this.note.id

        while (parent) {
            const note = notes.find((note) => note.id === parent)
            if (note) {
                ancestors.unshift({
                    label: note.displayName,
                    tab: { id: note.id, mode: 'note' } as TabType
                })
                parent = note.note.id
            } else {
                parent = null
            }
        }

        if (includeSelf) {
            ancestors.push({
                label: this.displayName,
                tab: { id: this.id, mode: 'note' } as TabType
            })
        }

        return ancestors
    }

    async destroyPermanently(): Promise<void> {
        api.deleteFile(this.image)
        this.tag.destroyAllPermanently()
        return super.destroyPermanently()
    }

    @lazy notes = this.collections
        .get<NoteModel>('note')
        .query(Q.where('note_id', this.id), Q.sortBy('order', Q.asc))

    @writer async addNote(data: NoteDataType) {
        const work = await this.work.fetch()
        return await this.collections.get<NoteModel>('note').create((note) => {
            note.note.set(this)
            note.work.set(work)
            note.title = data.title
            note.body = data.body
            note.color = data.color
            note.date = data.date
            note.url = data.url
            note.image = data.image
            note.status = Status.TODO
        })
    }

    @writer async updateRecord(data: Partial<NoteDataType>) {
        await this.update((note) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(note as any)[key] = value
            }
        })
    }

    @writer async updateAssociation(
        owner: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel
    ): Promise<void> {
        await this.update((note) => {
            switch (owner.table) {
                case 'character':
                    note.character.set(owner as CharacterModel)
                    break
                case 'item':
                    note.item.set(owner as ItemModel)
                    break
                case 'location':
                    note.location.set(owner as LocationModel)
                    break
                case 'note':
                    if (owner.id !== note.id) {
                        note.note.set(owner as NoteModel)
                    }
                    break
                case 'section':
                    note.section.set(owner as SectionModel)
                    break
            }
        })
    }

    @writer async delete() {
        const children = await this.notes.fetchCount()
        if (children) return
        await this.destroyPermanently()
        return true
    }
}
