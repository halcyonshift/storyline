import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, relation, writer } from '@nozbe/watermelondb/decorators'
import { CharacterModel, ItemModel, LocationModel, NoteModel, SectionModel, WorkModel } from './'

export default class TagModel extends Model {
    static table = 'tag'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        character: { type: 'belongs_to', key: 'character_id' },
        item: { type: 'belongs_to', key: 'item_id' },
        location: { type: 'belongs_to', key: 'location_id' },
        note: { type: 'belongs_to', key: 'note_id' },
        section: { type: 'belongs_to', key: 'section_id' }
    }

    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('character', 'character_id') character!: Relation<CharacterModel>
    @relation('item', 'item_id') item!: Relation<ItemModel>
    @relation('location', 'location_id') location!: Relation<LocationModel>
    @relation('note', 'note_id') note!: Relation<NoteModel>
    @relation('section', 'section_id') section!: Relation<SectionModel>
    @relation('work', 'work_id') work!: Relation<WorkModel>

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
