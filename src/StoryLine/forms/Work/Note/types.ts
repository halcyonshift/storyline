import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import { NoteDataType } from '@sl/db/models/types'

export type NoteFormProps = {
    belongsTo?: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel
    note?: NoteModel
    work?: WorkModel
    initialValues?: NoteDataType
    showDate?: boolean
}
