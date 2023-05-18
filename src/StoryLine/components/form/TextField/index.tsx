import { FormControl, TextField as MuiTextField } from '@mui/material'
import { TextFieldProps } from './types'
import { ReactNode } from 'react'

const TextField = ({ form, name, ...props }: TextFieldProps) => (
    <FormControl>
        <MuiTextField
            id={name}
            fullWidth={props.type === 'number' && !props.fullWidth ? false : props.fullWidth}
            value={form.values[name] ? form.values[name] : ''}
            onChange={(e) => form.setFieldValue(name, e.target.value)}
            error={form.touched[name] && Boolean(form.errors[name])}
            helperText={form.touched[name] && (form.errors[name] as ReactNode)}
            {...props}
        />
    </FormControl>
)

export default TextField
