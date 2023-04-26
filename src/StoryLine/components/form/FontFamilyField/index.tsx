import { MenuItem } from '@mui/material'
import { FontFamily } from '@sl/constants/fontFamily'
import SelectField from '../SelectField'
import { SelectFieldProps } from '../SelectField/types'

const FontFamilyField = ({ form, name, label, ...props }: SelectFieldProps) => (
    <SelectField form={form} name={name} label={label} {...props}>
        {Object.entries(FontFamily).map(([name, label]) => (
            <MenuItem key={`appFont-${name}`} value={name} sx={{ fontFamily: name }}>
                {label}
            </MenuItem>
        ))}
    </SelectField>
)

export default FontFamilyField
