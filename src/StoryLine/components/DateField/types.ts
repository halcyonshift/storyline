import { FormikProps } from 'formik'
import { ItemDataType, NoteDataType, SectionDataType } from '@sl/db/models/types'

export type FieldType = 'picker' | 'custom'

export type DateFieldProps = {
    fieldType?: FieldType
    form: FormikProps<ItemDataType | NoteDataType | SectionDataType>
}
