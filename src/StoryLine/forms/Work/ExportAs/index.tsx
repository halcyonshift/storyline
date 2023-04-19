import { Description, PictureAsPdf, Html } from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    FormControl,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material'

import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import TextField from '@sl/components/form/TextField'
import { ExportAsFormProps, ExportAsDataType, ExportModeTypes } from './types'

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
        sceneSeparator: yup.string().nullable()
    })

    const form: FormikProps<ExportAsDataType> = useFormik<ExportAsDataType>({
        enableReinitialize: true,
        initialValues: {
            mode: 'pdf',
            author: work.author,
            chapterTitle: t('form.work.backupRestore.exportAs.chapterTitleInitialValue'),
            chapterPosition: 'center',
            sceneSeparator: 'oOo'
        },
        validationSchema,
        onSubmit: (values: ExportAsDataType) => {
            generateExport(values)
        }
    })

    return (
        <Box component='form' className='grid grid-cols-2 gap-3' onSubmit={form.handleSubmit}>
            <Box>
                <TextField
                    label={t('form.work.backupRestore.exportAs.author')}
                    size='small'
                    name='author'
                    form={form}
                />
                <TextField
                    label={t('form.work.backupRestore.exportAs.chapterTitle')}
                    size='small'
                    name='chapterTitle'
                    form={form}
                />
                <FormControl>
                    <FormLabel id='chapter-position-label'>
                        {t('form.work.backupRestore.exportAs.chapterPosition')}
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby='chapter-position-label'
                        name='chapterPosition'
                        value={form.values.chapterPosition}
                        onChange={form.handleChange}>
                        <FormControlLabel value='left' control={<Radio />} label='Left' />
                        <FormControlLabel value='center' control={<Radio />} label='Center' />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label={t('form.work.backupRestore.exportAs.sceneSeparator')}
                    size='small'
                    name='sceneSeparator'
                    form={form}
                />
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
