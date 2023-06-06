import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import { StatusType } from '@sl/constants/status'
import { BreadcrumbType } from '@sl/layouts/Work/types'
import { displayDate, sortDate } from '@sl/utils'
import { CharacterDataType } from './types'
import { ConnectionModel, NoteModel, SectionModel, TagModel, WorkModel } from './'

export default class CharacterModel extends Model {
    static table = 'character'
    public static associations: Associations = {
        work: { type: 'belongs_to', key: 'work_id' },
        note: { type: 'has_many', foreignKey: 'character_id' },
        section: { type: 'has_many', foreignKey: 'pov_character_id' },
        tag: { type: 'has_many', foreignKey: 'character_id' }
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
    @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
    @relation('work', 'work_id') work!: Relation<WorkModel>
    @children('note') note!: Query<NoteModel>
    @children('section') section!: Query<SectionModel>
    @children('tag') tag!: Query<TagModel>

    get isPrimary() {
        return Boolean(this.mode === CharacterMode.PRIMARY)
    }

    get isSecondary() {
        return Boolean(this.mode === CharacterMode.SECONDARY)
    }

    get isTertiary() {
        return Boolean(this.mode === CharacterMode.TERTIARY)
    }

    get displayDateOfBirth() {
        return displayDate(this.dateOfBirth)
    }

    get sortDate() {
        return sortDate(this.dateOfBirth)
    }

    async getBreadcrumbs(): Promise<BreadcrumbType[]> {
        return []
    }

    async destroyPermanently(): Promise<void> {
        api.deleteFile(this.image)

        await this.collections
            .get<ConnectionModel>('connection')
            .query(Q.or(Q.where('id_a', this.id), Q.where('id_b', this.id)))
            .destroyAllPermanently()

        const scenes = await this.section.fetch()
        for await (const scene of scenes) {
            scene.updatePoVCharacter(null)
        }

        await this.tag.destroyAllPermanently()
        await this.note.destroyAllPermanently()
        await super.destroyPermanently()
    }

    @lazy notes = this.note.extend(Q.sortBy('order', Q.asc))

    @writer async updateRecord(data: Partial<CharacterDataType>) {
        await this.update((character) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(character as any)[key] = value
            }
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
