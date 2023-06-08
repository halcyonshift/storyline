/* eslint-disable max-len */
import { useState } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, InputAdornment, MenuItem, Tab, Typography } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import FontFamilyField from '@sl/components/form/FontFamilyField'
import FontSizeField from '@sl/components/form/FontSizeField'
import LineHeightField from '@sl/components/form/LineHeightField'
import ParagraphSpacingField from '@sl/components/form/ParagraphSpacingField'
import RadioField from '@sl/components/form/RadioField'
import SelectField from '@sl/components/form/SelectField'
import SwitchField from '@sl/components/form/SwitchField'
import TextField from '@sl/components/form/TextField'
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
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PALETTE,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_SPELL_CHECK
} from '@sl/constants/defaults'
import useSettings from '@sl/theme/useSettings'
import { SettingsDataType } from '@sl/theme/types'
import { SettingsFormProps } from './types'

const PALETTE_OPTIONS = ['slate', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

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
        lineHeight: DEFAULT_LINE_HEIGHT,
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
        lineHeight: yup.string().oneOf(['normal', 'relaxed', 'loose']).required(),
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
            settings.setLineHeight(values.lineHeight)
            settings.setPalette(values.palette)
            settings.setParagraphSpacing(values.paragraphSpacing)
            settings.setSpellCheck(values.spellCheck)
            messenger.success(t('form.storyline.settings.alert.success'))
        }
    })

    return (
        <Box
            id='settingsForm'
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
                        <Box className='grid grid-cols-1 gap-5'>
                            <Box className='grid grid-cols-2 gap-5'>
                                <FontFamilyField
                                    form={form}
                                    name='appFont'
                                    label={t('form.storyline.settings.font')}
                                />
                                <FontSizeField
                                    form={form}
                                    name='appFontSize'
                                    label={t('form.storyline.settings.fontSize')}
                                />
                            </Box>
                            <SelectField
                                form={form}
                                name='language'
                                label={t('form.storyline.settings.language')}
                                options={[{ value: 'en', label: 'English' }]}
                            />
                        </Box>
                        <Box className='grid grid-cols-1 gap-5'>
                            <SelectField
                                form={form}
                                name='displayMode'
                                label={t('form.storyline.settings.displayMode.label')}
                                options={[
                                    {
                                        value: 'light',
                                        label: t('form.storyline.settings.displayMode.light')
                                    },
                                    {
                                        value: 'dark',
                                        label: t('form.storyline.settings.displayMode.dark')
                                    }
                                ]}
                            />
                            <SelectField
                                form={form}
                                name='palette'
                                label={t('form.storyline.settings.palette')}>
                                {PALETTE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                        sx={{ backgroundColor: colors[option][200] }}>
                                        {capitalize(option)}
                                    </MenuItem>
                                ))}
                            </SelectField>
                        </Box>
                    </Box>
                    <Typography variant='h6' className='pt-5'>
                        {t('form.storyline.settings.backups.title')}
                    </Typography>
                    <Typography variant='body2' className='pb-2'>
                        {t('form.storyline.settings.backups.text')}
                    </Typography>
                    <Box className='grid grid-cols-2 gap-5'>
                        <TextField
                            form={form}
                            name='autoBackupPath'
                            label={t('form.storyline.settings.autoBackupPath.label')}
                            disabled
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
                        <RadioField
                            form={form}
                            name='autoBackupFreq'
                            label='form.storyline.settings.autoBackupFreq.label'
                            options={[
                                {
                                    value: 0,
                                    label: 'form.storyline.settings.autoBackupFreq.option0'
                                },
                                {
                                    value: 30,
                                    label: 'form.storyline.settings.autoBackupFreq.option30'
                                },
                                {
                                    value: 60,
                                    label: 'form.storyline.settings.autoBackupFreq.option60'
                                },
                                {
                                    value: 120,
                                    label: 'form.storyline.settings.autoBackupFreq.option120'
                                }
                            ]}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value='editor'>
                    <Box className='grid grid-cols-1 gap-5'>
                        <Box className='grid grid-cols-2 gap-5'>
                            <FontFamilyField
                                form={form}
                                name='editorFont'
                                label={t('form.storyline.settings.font')}
                            />
                            <FontSizeField
                                form={form}
                                name='editorFontSize'
                                label={t('form.storyline.settings.fontSize')}
                            />
                        </Box>
                        <Box className='grid grid-cols-2 gap-5'>
                            <LineHeightField
                                form={form}
                                name='lineHeight'
                                label='form.storyline.settings.lineHeight'
                            />
                            <ParagraphSpacingField
                                form={form}
                                name='paragraphSpacing'
                                label='form.storyline.settings.paragraphSpacing'
                            />
                        </Box>
                        <SwitchField
                            form={form}
                            name='indentParagraph'
                            label='form.storyline.settings.indentParagraph'
                        />
                        <SwitchField
                            form={form}
                            name='spellCheck'
                            label='form.storyline.settings.spellCheck'
                        />
                        <SwitchField
                            form={form}
                            name='autoSave'
                            label='form.storyline.settings.autoSave'
                        />
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
