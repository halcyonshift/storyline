import { FormikProps } from 'formik'

export type ColorFieldProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    label?: string
    name?: string
}
