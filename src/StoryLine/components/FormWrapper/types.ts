import { ReactNode } from 'react'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

export type FormWrapperProps = {
    title?: string
    model?: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel | WorkModel
    header?: ReactNode
    children: ReactNode
    padding?: boolean
}
