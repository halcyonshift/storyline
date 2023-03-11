import { FormikProps } from 'formik'
import { NoteDataType, SectionDataType } from '@sl/db/models/types'

export type FieldType = 'picker' | 'custom'

export type DateFieldProps = {
    fieldType?: FieldType
    form: FormikProps<NoteDataType | SectionDataType>
}
