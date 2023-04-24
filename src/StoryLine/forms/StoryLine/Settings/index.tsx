import { useState } from 'react'
import TextDecreaseIcon from '@mui/icons-material/TextDecrease'
import TextIncreaseIcon from '@mui/icons-material/TextIncrease'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
    Box,
    Button,
    Checkbox,
    InputAdornment,
    InputLabel,
    MenuItem,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Slider,
    Tab,
    TextField,
    Typography
} from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { FontFamily } from '@sl/constants/fontFamily'
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
        appFont: DEFAULT_FONT,
        appFontSize: DEFAULT_FONT_SIZE,
        editorFont: DEFAULT_FONT,
        editorFontSize: DEFAULT_FONT_SIZE,
        indentParagraph: DEFAULT_INDENT_PARAGRAPH,
        language: DEFAULT_LANGUAGE,
        lineSpacing: DEFAULT_LINE_SPACING,
        palette: DEFAULT_PALETTE,
        paragraphSpacing: DEFAULT_PARAGRAPH_SPACING,
        spellCheck: DEFAULT_SPELL_CHECK
    }
}: SettingsFormProps) => {
    const [value, setValue] = useState<string>('app')
    const messenger = useMessenger()
    const { t } = useTranslation()
    const settings = useSettings()
    const validationSchema = yup.object({
        autoSave: yup.boolean(),
        autoBackupFreq: yup.number().required(),
        autoBackupPath: yup.string().nullable(),
        displayMode: yup.string().required(),
        appFont: yup.string().required(),
        appFontSize: yup.number().positive().required(),
        editorFont: yup.string().required(),
        editorFontSize: yup.number().positive().required(),
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
            settings.setAppFont(values.appFont)
            settings.setAppFontSize(values.appFontSize)
            settings.setEditorFont(values.editorFont)
            settings.setEditorFontSize(values.editorFontSize)
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
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_, value) => setValue(value)} aria-label=''>
                        <Tab label={t('form.storyline.settings.tab.app')} value='app' />
                        <Tab label={t('form.storyline.settings.tab.editor')} value='editor' />
                    </TabList>
                </Box>
                <TabPanel value='app'>
                    <Box className='grid grid-cols-2 gap-5'>
                        <FormControl fullWidth>
                            <InputLabel id='select-app-font'>
                                {t('form.storyline.settings.font')}
                            </InputLabel>
                            <Select
                                name='appFont'
                                labelId='select-app-font'
                                value={form.values.appFont}
                                label={t('form.storyline.settings.font')}
                                onChange={form.handleChange}
                                error={form.touched.appFont && Boolean(form.errors.appFont)}>
                                {Object.entries(FontFamily).map(([name, label]) => (
                                    <MenuItem
                                        key={`appFont-${name}`}
                                        value={name}
                                        sx={{ fontFamily: name }}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <Stack spacing={2} direction='row' alignItems='center'>
                                <TextDecreaseIcon />
                                <Slider
                                    name='appFontSize'
                                    aria-label={t('form.storyline.settings.fontSize')}
                                    defaultValue={DEFAULT_FONT_SIZE}
                                    getAriaValueText={(value) => value.toString()}
                                    valueLabelDisplay='auto'
                                    step={1}
                                    marks
                                    min={12}
                                    max={24}
                                    value={form.values.appFontSize}
                                    onChange={form.handleChange}
                                />
                                <TextIncreaseIcon fontSize='large' />
                            </Stack>
                        </FormControl>
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
                                error={
                                    form.touched.displayMode && Boolean(form.errors.displayMode)
                                }>
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
                                <MenuItem
                                    value='orange'
                                    sx={{ backgroundColor: colors.orange[200] }}>
                                    Orange
                                </MenuItem>
                                <MenuItem
                                    value='yellow'
                                    sx={{ backgroundColor: colors.yellow[200] }}>
                                    Yellow
                                </MenuItem>
                                <MenuItem value='green' sx={{ backgroundColor: colors.green[200] }}>
                                    Green
                                </MenuItem>
                                <MenuItem value='blue' sx={{ backgroundColor: colors.blue[200] }}>
                                    Blue
                                </MenuItem>
                                <MenuItem
                                    value='indigo'
                                    sx={{ backgroundColor: colors.indigo[200] }}>
                                    Indigo
                                </MenuItem>
                                <MenuItem
                                    value='violet'
                                    sx={{ backgroundColor: colors.violet[200] }}>
                                    Violet
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </TabPanel>
                <TabPanel value='editor'>
                    <Box className='grid grid-cols-2 gap-5'>
                        <Box>
                            <Box className='grid grid-cols-2 gap-5'>
                                <FormControl fullWidth>
                                    <InputLabel id='select-editor-font'>
                                        {t('form.storyline.settings.font')}
                                    </InputLabel>
                                    <Select
                                        name='editorFont'
                                        labelId='select-editor-font'
                                        value={form.values.editorFont}
                                        label={t('form.storyline.settings.font')}
                                        onChange={form.handleChange}
                                        error={
                                            form.touched.editorFont &&
                                            Boolean(form.errors.editorFont)
                                        }>
                                        {Object.entries(FontFamily).map(([name, label]) => (
                                            <MenuItem
                                                key={`editorFont-${name}`}
                                                value={name}
                                                sx={{ fontFamily: name }}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Stack spacing={2} direction='row' alignItems='center'>
                                        <TextDecreaseIcon />
                                        <Slider
                                            name='editorFontSize'
                                            aria-label={t('form.storyline.settings.fontSize')}
                                            defaultValue={DEFAULT_FONT_SIZE}
                                            getAriaValueText={(value) => value.toString()}
                                            valueLabelDisplay='auto'
                                            step={1}
                                            marks
                                            min={12}
                                            max={24}
                                            value={form.values.editorFontSize}
                                            onChange={form.handleChange}
                                        />
                                        <TextIncreaseIcon fontSize='large' />
                                    </Stack>
                                </FormControl>
                            </Box>
                            <Box className='grid grid-cols-2 gap-5'>
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
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name='indentParagraph'
                                            checked={form.values.indentParagraph}
                                            onChange={form.handleChange}
                                            color='success'
                                            aria-label={t(
                                                'form.storyline.settings.indentParagraph'
                                            )}
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
                        </Box>
                        <Box>
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
                                        label={t(
                                            'form.storyline.settings.autoBackupFreq.option120'
                                        )}
                                    />
                                </RadioGroup>
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    id='autoBackupPath'
                                    label={t('form.storyline.settings.autoBackupPath.label')}
                                    name='autoBackupPath'
                                    variant='standard'
                                    disabled
                                    value={form.values.autoBackupPath}
                                    onChange={form.handleChange}
                                    error={
                                        form.touched.autoBackupPath &&
                                        Boolean(form.errors.autoBackupPath)
                                    }
                                    helperText={
                                        form.touched.autoBackupPath && form.errors.autoBackupPath
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <Button
                                                    onClick={async () => {
                                                        const filePath = await api.selectFilePath()
                                                        form.setFieldValue(
                                                            'autoBackupPath',
                                                            filePath
                                                        )
                                                    }}>
                                                    {t(
                                                        // eslint-disable-next-line max-len
                                                        'form.storyline.settings.autoBackupPath.select'
                                                    )}
                                                </Button>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </TabPanel>
            </TabContext>
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('form.storyline.settings.button.save')}
                </Button>
            </Box>
        </Box>
    )
}

export default SettingsForm
