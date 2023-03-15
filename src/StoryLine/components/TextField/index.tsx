import { TextField as MuiTextField } from '@mui/material'

import { TextFieldProps } from './types'

const TextField = ({ form, name, ...props }: TextFieldProps) => (
    <MuiTextField
        id={name}
        fullWidth
        margin='dense'
        value={form.values[name] ? form.values[name].toString() : ''}
        onChange={(e) => form.setFieldValue(name, e.target.value)}
        error={form.touched[name] && Boolean(form.errors[name])}
        {...props}
    />
)

export default TextField
