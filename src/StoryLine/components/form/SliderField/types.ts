import { FormikProps } from 'formik'

export type SliderFieldProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    label: string
    name: string
    defaultValue: number
    min: number
    max: number
}
