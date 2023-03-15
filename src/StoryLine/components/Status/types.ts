import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

export type StatusProps = {
    model: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel | WorkModel
}
