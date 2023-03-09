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
    character?: CharacterModel
    item?: ItemModel
    location?: LocationModel
    note?: NoteModel
    section?: SectionModel
    work?: WorkModel
    initialValues?: NoteDataType
    showDate?: boolean
}
