import { FormikProps } from 'formik'

export type FieldType = 'picker' | 'custom'

export type DateFieldProps = {
    fieldType?: FieldType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    label?: string
    fieldName?: string
}
