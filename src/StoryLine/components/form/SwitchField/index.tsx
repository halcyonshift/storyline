import { FormControl, FormControlLabel, Switch } from '@mui/material'
import { SwitchFieldProps } from './types'
import { useTranslation } from 'react-i18next'

const SwitchField = ({ form, name, label }: SwitchFieldProps) => {
    const { t } = useTranslation()

    return (
        <FormControl fullWidth>
            <FormControlLabel
                control={
                    <Switch
                        color='success'
                        name={name}
                        checked={form.values[name]}
                        onChange={form.handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        aria-label={t(label)}
                    />
                }
                label={t(label)}
            />
        </FormControl>
    )
}

export default SwitchField
