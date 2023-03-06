import { FormikProps } from 'formik'
import {
    AnnotationDataType,
    CharacterDataType,
    ItemDataType,
    LocationDataType,
    NoteDataType
} from '@sl/db/models/types'

export type ImageFieldProps = {
    label?: string
    form: FormikProps<
        AnnotationDataType | CharacterDataType | ItemDataType | LocationDataType | NoteDataType
    >
}
