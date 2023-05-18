import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { SelectFieldProps } from './types'

const SelectField = ({ form, name, label, options, children, ...props }: SelectFieldProps) => (
    <FormControl fullWidth>
        <InputLabel id={`select-${name}`}>{label}</InputLabel>
        <Select
            name={name}
            labelId={`select-${name}`}
            value={form.values[name]}
            label={label}
            onChange={form.handleChange}
            error={form.touched[name] && Boolean(form.errors[name])}
            {...props}>
            {options
                ? options.map((option, index) => (
                      <MenuItem key={`${option.value}-${index}`} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))
                : null}
            {children}
        </Select>
    </FormControl>
)

export default SelectField
