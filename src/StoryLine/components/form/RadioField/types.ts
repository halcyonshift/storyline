import { FormikProps } from 'formik'
import { OptionType } from '@sl/types'

export type RadioFieldProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    label: string
    name: string
    options: OptionType[]
}
