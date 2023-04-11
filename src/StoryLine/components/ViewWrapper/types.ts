import { ReactElement } from 'react'
import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'

export type ViewWrapperProps = {
    model: CharacterModel | ItemModel | LocationModel | NoteModel
    children: ReactElement | ReactElement[]
    tabList?: string[]
    notes: NoteModel[]
}
