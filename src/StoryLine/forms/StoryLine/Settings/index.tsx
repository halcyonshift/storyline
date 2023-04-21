import TextDecreaseIcon from '@mui/icons-material/TextDecrease'
import TextIncreaseIcon from '@mui/icons-material/TextIncrease'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import useMessenger from '@sl/layouts/useMessenger'
import { colors } from '@sl/theme/utils'

import {
    DEFAULT_AUTO_BACKUP_FREQ,
    DEFAULT_AUTO_SAVE,
    DEFAULT_DISPLAY_MODE,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_INDENT_PARAGRAPH,
    DEFAULT_LANGUAGE,
    DEFAULT_LINE_SPACING,
    DEFAULT_PALETTE,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_SPELL_CHECK
} from '@sl/constants/defaults'
import useSettings from '@sl/theme/useSettings'
import { SettingsDataType } from '@sl/theme/types'
import { SettingsFormProps } from './types'

const SettingsForm = ({
    initialValues = {
        autoSave: DEFAULT_AUTO_SAVE,
        autoBackupFreq: DEFAULT_AUTO_BACKUP_FREQ,
        autoBackupPath: '',
        displayMode: DEFAULT_DISPLAY_MODE,
        font: DEFAULT_FONT,
        fontSize: DEFAULT_FONT_SIZE,
        indentParagraph: DEFAULT_INDENT_PARAGRAPH,
        language: DEFAULT_LANGUAGE,
        lineSpacing: DEFAULT_LINE_SPACING,
        palette: DEFAULT_PALETTE,
        paragraphSpacing: DEFAULT_PARAGRAPH_SPACING,
        spellCheck: DEFAULT_SPELL_CHECK
    }
}: SettingsFormProps) => {
    const messenger = useMessenger()
    const { t } = useTranslation()
    const settings = useSettings()
    const validationSchema = yup.object({
        autoSave: yup.boolean(),
        autoBackupFreq: yup.number().required(),
        autoBackupPath: yup.string().nullable(),
        displayMode: yup.string().required(),
        font: yup.string().required(),
        fontSize: yup.number().positive().required(),
        indentParagraph: yup.boolean(),
        language: yup.string().required(),
        lineSpacing: yup.string().oneOf(['normal', 'relaxed', 'loose']).required(),
        palette: yup.string().required(),
        paragraphSpacing: yup.number().required(),
        spellCheck: yup.boolean()
    })

    const form: FormikProps<SettingsDataType> = useFormik<SettingsDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: SettingsDataType) => {
            settings.setAutoSave(values.autoSave)
            settings.setAutoBackupFreq(values.autoBackupFreq)
            settings.setAutoBackupPath(values.autoBackupPath)
            settings.setDisplayMode(values.displayMode)
            settings.setFont(values.font)
            settings.setFontSize(values.fontSize)
            settings.setIndentParagraph(values.indentParagraph)
            settings.setLanguage(values.language)
            settings.setLineSpacing(values.lineSpacing)
            settings.setPalette(values.palette)
            settings.setParagraphSpacing(values.paragraphSpacing)
            settings.setSpellCheck(values.spellCheck)
            messenger.success(t('form.storyline.settings.alert.success'))
        }
    })

    return (
        <Box
            component={'form'}
            onSubmit={form.handleSubmit}
            autoComplete='off'
            className='grid grid-cols-1 gap-4'>
            <Box className='grid grid-cols-2 gap-4'>
                <Box className='grid grid-cols-1 gap-4'>
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
                    <FormControl fullWidth>
                        <InputLabel id='select-palette'>
                            {t('form.storyline.settings.palette')}
                        </InputLabel>
                        <Select
                            name='palette'
                            labelId='select-palette'
                            value={form.values.palette}
                            label={t('form.storyline.settings.palette')}
                            onChange={form.handleChange}
                            error={form.touched.palette && Boolean(form.errors.palette)}>
                            <MenuItem value='slate' sx={{ backgroundColor: colors.slate[200] }}>
                                Slate
                            </MenuItem>
                            <MenuItem value='red' sx={{ backgroundColor: colors.red[200] }}>
                                Red
                            </MenuItem>
                            <MenuItem value='orange' sx={{ backgroundColor: colors.orange[200] }}>
                                Orange
                            </MenuItem>
                            <MenuItem value='yellow' sx={{ backgroundColor: colors.yellow[200] }}>
                                Yellow
                            </MenuItem>
                            <MenuItem value='green' sx={{ backgroundColor: colors.green[200] }}>
                                Green
                            </MenuItem>
                            <MenuItem value='blue' sx={{ backgroundColor: colors.blue[200] }}>
                                Blue
                            </MenuItem>
                            <MenuItem value='indigo' sx={{ backgroundColor: colors.indigo[200] }}>
                                Indigo
                            </MenuItem>
                            <MenuItem value='violet' sx={{ backgroundColor: colors.violet[200] }}>
                                Violet
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box className='grid grid-cols-1 gap-4'>
                    <Box className='grid grid-cols-2 gap-4'>
                        <FormControl fullWidth>
                            <InputLabel id='select-font'>
                                {t('form.storyline.settings.font')}
                            </InputLabel>
                            <Select
                                name='font'
                                labelId='select-font'
                                value={form.values.font}
                                label={t('form.storyline.settings.font')}
                                onChange={form.handleChange}
                                error={form.touched.font && Boolean(form.errors.font)}>
                                <MenuItem value='arial' sx={{ fontFamily: 'arial' }}>
                                    Arial
                                </MenuItem>
                                <MenuItem value='OpenDyslexic' sx={{ fontFamily: 'OpenDyslexic' }}>
                                    Open Dyslexic
                                </MenuItem>
                                <MenuItem value='roboto' sx={{ fontFamily: 'Roboto' }}>
                                    Roboto
                                </MenuItem>
                                <MenuItem
                                    value='times new roman'
                                    sx={{ fontFamily: 'times new roman' }}>
                                    Times New Roman
                                </MenuItem>
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
                        <FormControl fullWidth>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name='spellCheck'
                                        checked={form.values.spellCheck}
                                        onChange={form.handleChange}
                                        color='success'
                                        aria-label={t('form.storyline.settings.spellCheck')}
                                    />
                                }
                                label={t('form.storyline.settings.spellCheck')}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel id='lineSpacing'>
                                {t('form.storyline.settings.lineSpacing.label')}
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby='lineSpacing'
                                name='lineSpacing'
                                value={form.values.lineSpacing}
                                onChange={form.handleChange}>
                                <FormControlLabel
                                    value='normal'
                                    control={<Radio />}
                                    label={t('form.storyline.settings.lineSpacing.normal')}
                                />
                                <FormControlLabel
                                    value='relaxed'
                                    control={<Radio />}
                                    label={t('form.storyline.settings.lineSpacing.relaxed')}
                                />
                                <FormControlLabel
                                    value='loose'
                                    control={<Radio />}
                                    label={t('form.storyline.settings.lineSpacing.loose')}
                                />
                            </RadioGroup>
                        </FormControl>
                        <FormControl fullWidth>
                            <Typography gutterBottom>
                                {t('form.storyline.settings.paragraphSpacing')}
                            </Typography>
                            <Slider
                                name='paragraphSpacing'
                                aria-label={t('form.storyline.settings.paragraphSpacing')}
                                defaultValue={DEFAULT_PARAGRAPH_SPACING}
                                getAriaValueText={(value) => value.toString()}
                                valueLabelDisplay='auto'
                                step={1}
                                marks
                                min={2}
                                max={10}
                                value={form.values.paragraphSpacing}
                                onChange={form.handleChange}
                            />
                        </FormControl>
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box className='grid grid-cols-2 gap-4'>
                <Box>
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name='autoSave'
                                    checked={form.values.autoSave}
                                    onChange={form.handleChange}
                                    color='success'
                                    aria-label={t('form.storyline.settings.autoSave')}
                                />
                            }
                            label={t('form.storyline.settings.autoSave')}
                        />
                    </FormControl>
                </Box>
                <Box className='grid grid-cols-1 gap-4'>
                    <FormControl fullWidth>
                        <FormLabel id='autoBackupFreq'>
                            {t('form.storyline.settings.autoBackupFreq.label')}
                        </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby='autoBackupFreq'
                            name='autoBackupFreq'
                            value={form.values.autoBackupFreq}
                            onChange={form.handleChange}>
                            <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label={t('form.storyline.settings.autoBackupFreq.option0')}
                            />
                            <FormControlLabel
                                value={30}
                                control={<Radio />}
                                label={t('form.storyline.settings.autoBackupFreq.option30')}
                            />
                            <FormControlLabel
                                value={60}
                                control={<Radio />}
                                label={t('form.storyline.settings.autoBackupFreq.option60')}
                            />
                            <FormControlLabel
                                value={120}
                                control={<Radio />}
                                label={t('form.storyline.settings.autoBackupFreq.option120')}
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <TextField
                            id='autoBackupPath'
                            label={t('form.storyline.settings.autoBackupPath.label')}
                            name='autoBackupPath'
                            variant='standard'
                            disabled
                            value={form.values.autoBackupPath}
                            onChange={form.handleChange}
                            error={
                                form.touched.autoBackupPath && Boolean(form.errors.autoBackupPath)
                            }
                            helperText={form.touched.autoBackupPath && form.errors.autoBackupPath}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <Button
                                            onClick={async () => {
                                                const filePath = await api.selectFilePath()
                                                form.setFieldValue('autoBackupPath', filePath)
                                            }}>
                                            {t('form.storyline.settings.autoBackupPath.select')}
                                        </Button>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </FormControl>
                </Box>
            </Box>
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('form.storyline.settings.button.save')}
                </Button>
            </Box>
        </Box>
    )
}

export default SettingsForm
