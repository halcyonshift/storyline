import { FormikProps } from 'formik'
import { LocationDataType } from '@sl/db/models/types'

export type FieldType = 'picker' | 'custom'

export type MapFieldProps = {
    fieldType?: FieldType
    form: FormikProps<LocationDataType>
}
