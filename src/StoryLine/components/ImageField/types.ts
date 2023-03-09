import { FormikProps } from 'formik'
import {
    CharacterDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType
} from '@sl/db/models/types'

export type ImageFieldProps = {
    label?: string
    dir: string
    form: FormikProps<CharacterDataType | ItemDataType | LocationDataType | NoteDataType>
}
