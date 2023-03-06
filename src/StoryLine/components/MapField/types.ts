import { FormikProps } from 'formik'
import { LocationDataType } from '@sl/db/models/types'

export type FieldType = 'picker' | 'custom'

export type MapFieldProps = {
    label?: string
    fieldType?: FieldType
    form: FormikProps<LocationDataType>
}
