import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FontFamily } from '@sl/constants/fontFamily'
import { FontFamilyFieldProps } from './types'

const FontFamilyField = ({
    form,
    name = 'font',
    label = 'component.fontFamilyField.label'
}: FontFamilyFieldProps) => {
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
                error={form.touched[name] && Boolean(form.errors[name])}>
                {Object.entries(FontFamily).map(([name, label]) => (
                    <MenuItem key={`appFont-${name}`} value={name} sx={{ fontFamily: name }}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default FontFamilyField
