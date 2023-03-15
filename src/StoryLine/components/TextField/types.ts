import { FormikProps } from 'formik'

import { TextFieldProps as MuiTextFieldProps } from '@mui/material'

export type TextFieldProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
} & MuiTextFieldProps
