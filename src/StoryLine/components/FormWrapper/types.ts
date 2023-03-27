import { ReactElement } from 'react'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import { FormikProps } from 'formik'

export type FormWrapperProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    title?: string
    model?: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel | WorkModel
    header?: ReactElement
    children: ReactElement | ReactElement[]
    tabList: string[]
    notes: NoteModel[]
}
