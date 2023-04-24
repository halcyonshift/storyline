import { Box, TextField as MuiTextField } from '@mui/material'

import { TextFieldProps } from './types'

const TextField = ({ form, name, ...props }: TextFieldProps) => (
    <Box>
        <MuiTextField
            id={name}
            fullWidth={props.type === 'number' && !props.fullWidth ? false : true}
            margin='dense'
            value={form.values[name] ? form.values[name] : ''}
            onChange={(e) => form.setFieldValue(name, e.target.value)}
            error={form.touched[name] && Boolean(form.errors[name])}
            {...props}
        />
    </Box>
)

export default TextField
