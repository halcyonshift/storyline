import { MenuItem } from '@mui/material'
import { FontFamily, SafeFontFamily } from '@sl/constants/fontFamily'
import SelectField from '../SelectField'
import { SelectFieldProps } from '../SelectField/types'

const FontFamilyField = ({
    form,
    name,
    label,
    mode,
    ...props
}: SelectFieldProps & { mode?: 'safe' | 'full' }) => (
    <SelectField form={form} name={name} label={label} {...props}>
        {Object.entries(mode === 'safe' ? SafeFontFamily : FontFamily).map(([name, label]) => (
            <MenuItem key={`appFont-${name}`} value={name} sx={{ fontFamily: name }}>
                {label}
            </MenuItem>
        ))}
    </SelectField>
)

export default FontFamilyField
