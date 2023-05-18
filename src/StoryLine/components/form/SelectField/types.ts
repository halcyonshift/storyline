import { SelectProps } from '@mui/material'
import { FormikProps } from 'formik'
import { OptionType } from '@sl/types'

export interface SelectFieldProps extends SelectProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    options?: OptionType[]
}
