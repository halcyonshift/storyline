import { TextDecrease, TextIncrease } from '@mui/icons-material'
import { FormControl, Slider, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FontSizeFieldProps } from './types'
import { DEFAULT_FONT_SIZE } from '@sl/constants/defaults'

const FontSizeField = ({
    form,
    name = 'fontSize',
    label = 'component.fontFamilyField.label'
}: FontSizeFieldProps) => {
    const { t } = useTranslation()
    return (
        <FormControl fullWidth>
            <Stack spacing={2} direction='row' alignItems='center'>
                <TextDecrease />
                <Slider
                    name={name}
                    aria-label={t(label)}
                    defaultValue={DEFAULT_FONT_SIZE}
                    getAriaValueText={(value) => value.toString()}
                    valueLabelDisplay='auto'
                    step={1}
                    marks
                    min={10}
                    max={24}
                    value={form.values[name]}
                    onChange={form.handleChange}
                />
                <TextIncrease fontSize='large' />
            </Stack>
        </FormControl>
    )
}

export default FontSizeField
