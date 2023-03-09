import TextDecreaseIcon from '@mui/icons-material/TextDecrease'
import TextIncreaseIcon from '@mui/icons-material/TextIncrease'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { DEFAULT_FONT_SIZE } from '@sl/constants/defaults'
import { useSettings } from '@sl/theme'
import { SettingsDataType } from '@sl/theme/types'
import { SettingsFormProps } from './types'

const SettingsForm = ({
    initialValues = {
        language: 'en',
        displayMode: 'light',
        font: 'roboto',
        fontSize: 14,
        indentParagraph: true
    }
}: SettingsFormProps) => {
    const { t } = useTranslation()
    const { setDisplayMode, setFont, setFontSize, setIndentParagraph, setLanguage } = useSettings()

    const validationSchema = yup.object({
        language: yup.string().required(),
        displayMode: yup.string().required(),
        font: yup.string().required(),
        fontSize: yup.number().positive().required(),
        indentParagraph: yup.boolean().required()
    })

    const form: FormikProps<SettingsDataType> = useFormik<SettingsDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: SettingsDataType) => {
            setDisplayMode(values.displayMode)
            setFont(values.font)
            setFontSize(values.fontSize)
            setIndentParagraph(values.indentParagraph)
            setLanguage(values.language)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <FormControl fullWidth>
                <InputLabel id='select-language'>
                    {t('form.storyline.settings.language')}
                </InputLabel>
                <Select
                    name='language'
                    labelId='select-language'
                    value={form.values.language}
                    label={t('form.storyline.settings.language')}
                    onChange={form.handleChange}
                    error={form.touched.language && Boolean(form.errors.language)}>
                    <MenuItem value='en'>English</MenuItem>
                    <MenuItem value='fr'>Français</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id='select-displayMode'>
                    {t('form.storyline.settings.displayMode.label')}
                </InputLabel>
                <Select
                    name='displayMode'
                    labelId='select-displayMode'
                    value={form.values.displayMode}
                    label={t('form.storyline.settings.displayMode.label')}
                    onChange={form.handleChange}
                    error={form.touched.displayMode && Boolean(form.errors.displayMode)}>
                    <MenuItem value='light'>
                        {t('form.storyline.settings.displayMode.light')}
                    </MenuItem>
                    <MenuItem value='dark'>
                        {t('form.storyline.settings.displayMode.dark')}
                    </MenuItem>
                </Select>
            </FormControl>
            <Stack direction='row' spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id='select-font'>{t('form.storyline.settings.font')}</InputLabel>
                    <Select
                        name='font'
                        labelId='select-font'
                        value={form.values.font}
                        label={t('form.storyline.settings.font')}
                        onChange={form.handleChange}
                        error={form.touched.font && Boolean(form.errors.font)}>
                        <MenuItem value='arial'>Arial</MenuItem>
                        <MenuItem value='open-dyslexic'>Open Dyslexic</MenuItem>
                        <MenuItem value='roboto'>Roboto</MenuItem>
                        <MenuItem value='times new roman'>Times New Roman</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <Stack spacing={2} direction='row' alignItems='center'>
                        <TextDecreaseIcon />
                        <Slider
                            name='fontSize'
                            aria-label={t('form.storyline.settings.fontSize')}
                            defaultValue={DEFAULT_FONT_SIZE}
                            getAriaValueText={(value) => value.toString()}
                            valueLabelDisplay='auto'
                            step={1}
                            marks
                            min={12}
                            max={24}
                            value={form.values.fontSize}
                            onChange={form.handleChange}
                        />
                        <TextIncreaseIcon fontSize='large' />
                    </Stack>
                </FormControl>
            </Stack>

            <FormControl fullWidth>
                <FormControlLabel
                    control={
                        <Checkbox
                            name='indentParagraph'
                            checked={form.values.indentParagraph}
                            onChange={form.handleChange}
                            color='success'
                            aria-label={t('form.storyline.settings.indentParagraph')}
                        />
                    }
                    label={t('form.storyline.settings.indentParagraph')}
                />
            </FormControl>
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('form.storyline.settings.button.save')}
                </Button>
            </Box>
        </Stack>
    )
}

export default SettingsForm
