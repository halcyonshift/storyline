import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators'

import NoteModel from './NoteModel'
import WorkModel from './WorkModel'

export default class CharacterModel extends Model {
    static table = 'character'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'character_id' }
    }

    @field('mode') mode!: 'main' | 'secondary' | 'tertiary'
    @text('display_name') displayName!: string
    @text('pronouns') pronouns!: string
    @text('first_name') firstName!: string
    @text('last_name') lastName!: string
    @text('nickname') nickname!: string
    @text('gender') gender!: string
    @text('apparent_age') apparentAge!: number
    @text('date_of_birth') dateOfBirth!: string
    @text('place_of_birth') placeOfBirth!: string
    @text('education') education!: string
    @text('profession') profession!: string
    @text('finances') finances!: string
    @text('residence') residence!: string
    @text('race') race!: string
    @text('build') build!: string
    @text('height') height!: string
    @text('weight') weight!: string
    @text('hair') hair!: string
    @text('face') face!: string
    @text('eyes') eyes!: string
    @text('nose') nose!: string
    @text('mouth') mouth!: string
    @text('ears') ears!: string
    @text('hands') hands!: string
    @text('distinguishing_features') distinguishingFeatures!: string
    @text('description') description!: string
    @text('body') body!: string
    @text('image') image!: string
    @text('conflict') conflict!: string
    @text('evolution') evolution!: string
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') note!: Query<NoteModel>

    get isMain() {
        return Boolean(this.mode === 'main')
    }

    get isSecondary() {
        return Boolean(this.mode === 'secondary')
    }

    get isTertiary() {
        return Boolean(this.mode === 'tertiary')
    }
}
