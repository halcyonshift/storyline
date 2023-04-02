import { NoteModel } from '@sl/db/models'

export type NodeType = {
    data?: NoteModel
    children?: NodeType[]
}

export type NodeGroupType = {
    [key: string]: NodeType
}
