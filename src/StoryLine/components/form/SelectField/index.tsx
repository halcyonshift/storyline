import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SelectFieldProps } from './types'

const SelectField = ({ form, name, label, options, children }: SelectFieldProps) => {
    const { t } = useTranslation()
    return (
        <FormControl fullWidth>
            <InputLabel id={`select-${name}`}>{t(label)}</InputLabel>
            <Select
                name={name}
                labelId={`select-${name}`}
                value={form.values[name]}
                label={t(label)}
                onChange={form.handleChange}
                error={form.touched.language && Boolean(form.errors.language)}>
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
}

export default SelectField
