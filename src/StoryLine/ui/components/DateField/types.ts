import { FormikProps } from 'formik'
import { SectionDataType } from '../../../db/models/types'

export type FieldType = 'picker' | 'custom'

export type DateProps = {
    fieldType?: FieldType
    form: FormikProps<SectionDataType>
}
