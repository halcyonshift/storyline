import { NoteModel } from '@sl/db/models'

export type FlatViewProps = {
    notes: NoteModel[]
}

export type NestedViewProps = {
    notes: NoteModel[]
    parent?: string
}
