import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import FontFamilyField from '@sl/components/form/FontFamilyField'
import FontSizeField from '@sl/components/form/FontSizeField'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import LineHeightField from '@sl/components/form/LineHeightField'
import ParagraphSpacingField from '@sl/components/form/ParagraphSpacingField'
import RadioField from '@sl/components/form/RadioField'
import SwitchField from '@sl/components/form/SwitchField'
import TextField from '@sl/components/form/TextField'
import { ExportAsFormProps, ExportAsDataType, ExportModeTypes } from './types'
import {
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_INDENT_PARAGRAPH
} from '@sl/constants/defaults'
import useSettings from '@sl/theme/useSettings'

const ExportAsForm = ({ work, generateExport, isGenerating }: ExportAsFormProps) => {
    const settings = useSettings()
    const { t } = useTranslation()

    const exportModes: ExportModeTypes[] = [
        {
            mode: 'epub',
            icon: IMPORTEXPORT_ICONS.epub
        },
        {
            mode: 'pdf',
            icon: IMPORTEXPORT_ICONS.pdf
        },
        {
            mode: 'docx',
            icon: IMPORTEXPORT_ICONS.docx
        },
        {
            mode: 'html',
            icon: IMPORTEXPORT_ICONS.html
        }
    ]

    const validationSchema = yup.object({
        chapterTitle: yup.string().nullable(),
        chapterPosition: yup.string().oneOf(['left', 'center']),
        author: yup.string().nullable(),
        sceneSeparator: yup.string().nullable(),
        lineHeight: yup.string().oneOf(['normal', 'relaxed', 'loose']),
        paragraphSpacing: yup.number(),
        font: yup.string(),
        fontSize: yup.number(),
        indentParagraph: yup.boolean()
    })

    const form: FormikProps<ExportAsDataType> = useFormik<ExportAsDataType>({
        enableReinitialize: true,
        initialValues: {
            mode: 'epub',
            author: work.author,
            chapterTitle: t('form.work.backupRestore.exportAs.chapterTitleInitialValue'),
            chapterPosition: 'center',
            sceneSeparator: 'oOo',
            lineHeight: DEFAULT_LINE_HEIGHT,
            paragraphSpacing: DEFAULT_PARAGRAPH_SPACING,
            font: DEFAULT_FONT,
            fontSize: DEFAULT_FONT_SIZE,
            indentParagraph: DEFAULT_INDENT_PARAGRAPH
        },
        validationSchema,
        onSubmit: (values: ExportAsDataType) => {
            generateExport(values)
        }
    })

    return (
        <Box component='form' className='grid grid-cols-2 gap-3' onSubmit={form.handleSubmit}>
            <Box className='p-5'>
                <Box className='grid grid-cols-1 gap-3'>
                    <Box className='grid grid-cols-2 gap-3'>
                        <FontFamilyField
                            form={form}
                            name='font'
                            label={t('form.work.backupRestore.exportAs.font')}
                            size='small'
                        />
                        <FontSizeField
                            form={form}
                            name='fontSize'
                            label='form.work.backupRestore.exportAs.fontSize'
                        />
                    </Box>
                    <LineHeightField
                        form={form}
                        name='lineHeight'
                        label='form.work.backupRestore.exportAs.lineHeight'
                    />
                    <ParagraphSpacingField
                        form={form}
                        name='paragraphSpacing'
                        label='form.work.backupRestore.exportAs.paragraphSpacing'
                    />
                    <SwitchField
                        form={form}
                        name='indentParagraph'
                        label='form.work.backupRestore.exportAs.indentParagraph'
                    />
                </Box>
            </Box>
            <Box className='p-5'>
                <Box className='grid grid-cols-1 gap-5'>
                    <TextField
                        margin='none'
                        label={t('form.work.backupRestore.exportAs.author')}
                        name='author'
                        form={form}
                        size='small'
                    />
                    <Box className='grid grid-cols-2 gap-3'>
                        <TextField
                            label={t('form.work.backupRestore.exportAs.chapterTitle')}
                            size='small'
                            margin='none'
                            name='chapterTitle'
                            form={form}
                        />
                        <RadioField
                            form={form}
                            label='form.work.backupRestore.exportAs.chapterPosition.label'
                            name='chapterPosition'
                            options={[
                                {
                                    value: 'left',
                                    label: 'form.work.backupRestore.exportAs.chapterPosition.left'
                                },
                                {
                                    value: 'center',
                                    label: 'form.work.backupRestore.exportAs.chapterPosition.center'
                                }
                            ]}
                        />
                    </Box>
                    <TextField
                        fullWidth={false}
                        label={t('form.work.backupRestore.exportAs.sceneSeparator')}
                        size='small'
                        margin='none'
                        name='sceneSeparator'
                        form={form}
                    />
                    <Box className='grid grid-cols-1 gap-3'>
                        <Box className='flex justify-around bg-slate-200 dark:bg-slate-600 rounded-lg p-3'>
                            {exportModes.map((exportMode) => (
                                <TooltipIconButton
                                    text={`.${exportMode.mode}`}
                                    icon={exportMode.icon}
                                    key={exportMode.mode}
                                    sx={{ fontSize: settings.appFontSize * 3 }}
                                    color={
                                        form.values.mode === exportMode.mode ? 'info' : 'default'
                                    }
                                    onClick={() => form.setFieldValue('mode', exportMode.mode)}
                                />
                            ))}
                        </Box>
                        <Box textAlign='center'>
                            <Button variant='contained' type='submit' disabled={isGenerating}>
                                {isGenerating ? (
                                    <CircularProgress size={settings.appFontSize * 2} />
                                ) : (
                                    t('form.work.backupRestore.exportAs.button.export')
                                )}
                            </Button>
                            {isGenerating ? (
                                <Typography variant='body2' className='text-slate-600 pt-3'>
                                    {t('form.work.backupRestore.exportAs.helpText')}
                                </Typography>
                            ) : null}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ExportAsForm
