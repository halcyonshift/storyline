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
import { StatusType } from '@sl/constants/status'
import NoteModel from './NoteModel'
import WorkModel from './WorkModel'
import { CharacterDataType } from './types'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'

export default class CharacterModel extends Model {
    static table = 'character'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'character_id' }
    }
    @field('mode') mode!: CharacterModeType
    @field('status') status!: StatusType
    @field('image') image!: string
    @text('display_name') displayName!: string
    @text('description') description!: string
    @text('history') history!: string
    @text('pronouns') pronouns!: string
    @text('first_name') firstName!: string
    @text('last_name') lastName!: string
    @text('nickname') nickname!: string
    @text('nationality') nationality!: string
    @text('ethnicity') ethnicity!: string
    @text('place_of_birth') placeOfBirth!: string
    @text('residence') residence!: string
    @text('gender') gender!: string
    @text('sexual_orientation') sexualOrientation!: string
    @text('date_of_birth') dateOfBirth!: string
    @text('apparent_age') apparentAge!: string
    @text('religion') religion!: string
    @text('social_class') socialClass!: string
    @text('education') education!: string
    @text('profession') profession!: string
    @text('finances') finances!: string
    @text('political_leaning') politicalLeaning!: string
    @text('face') face!: string
    @text('build') build!: string
    @text('height') height!: string
    @text('weight') weight!: string
    @text('hair') hair!: string
    @text('hair_natural') hairNatural!: string
    @text('distinguishing_features') distinguishingFeatures!: string
    @text('personality_positive') personalityPositive!: string
    @text('personality_negative') personalityNegative!: string
    @text('ambitions') ambitions!: string
    @text('fears') fears!: string
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') note!: Query<NoteModel>

    get isPrimary() {
        return Boolean(this.mode === CharacterMode.PRIMARY)
    }

    get isSecondary() {
        return Boolean(this.mode === CharacterMode.SECONDARY)
    }

    get isTertiary() {
        return Boolean(this.mode === CharacterMode.TERTIARY)
    }

    @writer async updateCharacter(data: CharacterDataType) {
        await this.update((character) => {
            character.mode = data.mode
            character.image = data.image
            character.displayName = data.displayName
            character.description = data.description
            character.history = data.history
            character.pronouns = data.pronouns
            character.firstName = data.firstName
            character.lastName = data.lastName
            character.nickname = data.nickname
            character.nationality = data.nationality
            character.ethnicity = data.ethnicity
            character.placeOfBirth = data.placeOfBirth
            character.residence = data.residence
            character.gender = data.gender
            character.sexualOrientation = data.sexualOrientation
            character.dateOfBirth = data.dateOfBirth
            character.apparentAge = data.apparentAge
            character.religion = data.religion
            character.socialClass = data.socialClass
            character.education = data.education
            character.profession = data.profession
            character.finances = data.finances
            character.politicalLeaning = data.politicalLeaning
            character.face = data.face
            character.build = data.build
            character.height = data.height
            character.weight = data.weight
            character.hair = data.hair
            character.hairNatural = data.hairNatural
            character.distinguishingFeatures = data.distinguishingFeatures
            character.personalityPositive = data.personalityPositive
            character.personalityNegative = data.personalityNegative
            character.ambitions = data.ambitions
            character.fears = data.fears
        })
    }

    @writer async updateStatus(status: StatusType) {
        await this.update((character) => {
            character.status = status
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
