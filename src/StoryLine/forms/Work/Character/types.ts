import { CharacterModeType } from '@sl/constants/characterMode'
import { CharacterModel, WorkModel } from '@sl/db/models'
import { CharacterDataType } from '@sl/db/models/types'

export type CharacterFormProps = {
    mode?: CharacterModeType
    character?: CharacterModel
    initialValues?: CharacterDataType
    work?: WorkModel
}
