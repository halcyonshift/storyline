import { FormikProps } from 'formik'
import { SectionDataType } from '@sl/db/models/types'

export type FieldType = 'picker' | 'custom'

export type DateFieldProps = {
    fieldType?: FieldType
    form: FormikProps<SectionDataType>
}
