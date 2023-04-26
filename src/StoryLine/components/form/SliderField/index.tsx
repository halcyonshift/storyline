import { FormControl, Slider, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SliderFieldProps } from './types'

const SliderField = ({ form, name, label, min, max, defaultValue }: SliderFieldProps) => {
    const { t } = useTranslation()
    return (
        <FormControl fullWidth>
            <Typography gutterBottom>{t(label)}</Typography>
            <Slider
                name={name}
                aria-label={t(label)}
                defaultValue={defaultValue}
                getAriaValueText={(value) => value.toString()}
                valueLabelDisplay='auto'
                step={1}
                marks
                min={min}
                max={max}
                value={form.values[name]}
                onChange={form.handleChange}
            />
        </FormControl>
    )
}

export default SliderField
