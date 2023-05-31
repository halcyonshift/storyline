import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { RadioFieldProps } from './types'
import { useTranslation } from 'react-i18next'

const RadioField = ({ form, name, label, options }: RadioFieldProps) => {
    const { t } = useTranslation()

    return (
        <FormControl fullWidth>
            <FormLabel id={name}>{t(label)}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={name}
                name={name}
                value={form.values[name]}
                onChange={form.handleChange}>
                {options.map((option) => (
                    <FormControlLabel
                        key={crypto.randomUUID()}
                        value={option.value}
                        control={<Radio />}
                        label={t(option.label)}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export default RadioField
