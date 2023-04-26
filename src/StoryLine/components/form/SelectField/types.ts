import { FormikProps } from 'formik'
import { ReactElement } from 'react'
import { OptionType } from '@sl/types'

export type SelectFieldProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    options?: OptionType[]
    label: string
    name: string
    children?: ReactElement[]
}
