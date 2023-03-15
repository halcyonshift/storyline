import { FormikProps } from 'formik'

export type TextareaFieldProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    label?: string
    fieldName?: string
}
