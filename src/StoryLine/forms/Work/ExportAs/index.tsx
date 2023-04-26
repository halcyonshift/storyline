import { Description, PictureAsPdf, Html } from '@mui/icons-material'
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material'

import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import FontFamilyField from '@sl/components/form/FontFamilyField'
import FontSizeField from '@sl/components/form/FontSizeField'
import LineHeightField from '@sl/components/form/LineHeightField'
import ParagraphSpacingField from '@sl/components/form/ParagraphSpacingField'
import RadioField from '@sl/components/form/RadioField'
import TextField from '@sl/components/form/TextField'
import { ExportAsFormProps, ExportAsDataType, ExportModeTypes } from './types'
import {
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE
} from '@sl/constants/defaults'

const ExportAsForm = ({ work, generateExport, isGenerating }: ExportAsFormProps) => {
    const { t } = useTranslation()

    const exportModes: ExportModeTypes[] = [
        {
            mode: 'pdf',
            icon: <PictureAsPdf fontSize='large' />
        },
        {
            mode: 'docx',
            icon: <Description fontSize='large' />
        },
        {
            mode: 'html',
            icon: <Html fontSize='large' />
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
        fontSize: yup.number()
    })

    const form: FormikProps<ExportAsDataType> = useFormik<ExportAsDataType>({
        enableReinitialize: true,
        initialValues: {
            mode: 'pdf',
            author: work.author,
            chapterTitle: t('form.work.backupRestore.exportAs.chapterTitleInitialValue'),
            chapterPosition: 'center',
            sceneSeparator: 'oOo',
            lineHeight: DEFAULT_LINE_HEIGHT,
            paragraphSpacing: DEFAULT_PARAGRAPH_SPACING,
            font: DEFAULT_FONT,
            fontSize: DEFAULT_FONT_SIZE
        },
        validationSchema,
        onSubmit: (values: ExportAsDataType) => {
            generateExport(values)
        }
    })

    return (
        <Box component='form' className='grid grid-cols-2 gap-3' onSubmit={form.handleSubmit}>
            <Box className='grid grid-cols-1 gap-2'>
                <TextField
                    label={t('form.work.backupRestore.exportAs.author')}
                    size='small'
                    name='author'
                    form={form}
                />
                <Box className='grid grid-cols-2 gap-3'>
                    <TextField
                        label={t('form.work.backupRestore.exportAs.chapterTitle')}
                        size='small'
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
                    name='sceneSeparator'
                    form={form}
                />
                <Box className='grid grid-cols-2 gap-3 mt-2'>
                    <FontFamilyField
                        form={form}
                        name='font'
                        label='form.work.backupRestore.exportAs.font'
                    />
                    <FontSizeField
                        form={form}
                        name='fontSize'
                        label='form.work.backupRestore.exportAs.fontSize'
                    />
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
                </Box>
            </Box>
            <Box className='flex flex-col justify-around'>
                <Box className='flex justify-around'>
                    {exportModes.map((exportMode) => (
                        <IconButton
                            key={exportMode.mode}
                            color={form.values.mode === exportMode.mode ? 'info' : 'default'}
                            onClick={() => form.setFieldValue('mode', exportMode.mode)}>
                            {exportMode.icon}
                        </IconButton>
                    ))}
                </Box>
                <Box textAlign='center'>
                    <Button variant='contained' type='submit' disabled={isGenerating}>
                        {isGenerating ? (
                            <CircularProgress size={24} />
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
    )
}

export default ExportAsForm
