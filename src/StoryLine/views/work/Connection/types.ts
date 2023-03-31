import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'

export type ObjType = CharacterModel | ItemModel | LocationModel | NoteModel

export type NodeType = {
    id: string
    label: string
    table: string
    obj: ObjType
}

export type NodeTypeByID = {
    [key: string]: NodeType
}
