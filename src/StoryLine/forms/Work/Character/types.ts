import { CharacterModel, WorkModel } from '@sl/db/models'
import { CharacterDataType } from '@sl/db/models/types'

export type CharacterFormProps = {
    character?: CharacterModel
    initialValues: CharacterDataType
    work?: WorkModel
}
