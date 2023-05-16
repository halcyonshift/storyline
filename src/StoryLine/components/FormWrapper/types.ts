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
import {
    CharacterDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType,
    SectionDataType,
    WorkDataType
} from '@sl/db/models/types'

export type FormTabListProps = {
    setValue: (value: string) => void
    tabList: string[]
    notes: NoteModel[]
    errorBadges: ErrorBadgeType
}

export type FormWrapperProps = {
    form: FormikProps<
        | CharacterDataType
        | ItemDataType
        | LocationDataType
        | NoteDataType
        | SectionDataType
        | WorkDataType
    >
    title?: string
    model?: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel | WorkModel
    header?: ReactElement
    children: ReactElement | ReactElement[]
    tabList: string[]
    notes: NoteModel[]
}

export type ErrorBadgeType = {
    [key: string]: number
}

export type FormFieldType = {
    [key: string]: string[]
}
