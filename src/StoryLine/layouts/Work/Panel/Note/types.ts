import { NoteModel } from '@sl/db/models'

export type BlockType = {
    note: NoteModel
    index: number
    fontWeight: number
}
