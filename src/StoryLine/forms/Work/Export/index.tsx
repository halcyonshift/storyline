import { forwardRef } from 'react'
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    IconButton,
    Slide,
    Toolbar,
    Typography
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import FontFamilyField from '@sl/components/form/FontFamilyField'
import FontSizeField from '@sl/components/form/FontSizeField'
import LineHeightField from '@sl/components/form/LineHeightField'
import ParagraphSpacingField from '@sl/components/form/ParagraphSpacingField'
import RadioField from '@sl/components/form/RadioField'
import SwitchField from '@sl/components/form/SwitchField'
import TextField from '@sl/components/form/TextField'
import {
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_FONT_SIZE,
    DEFAULT_INDENT_PARAGRAPH
} from '@sl/constants/defaults'
import useSettings from '@sl/theme/useSettings'
import { ExportFormProps, ExportDataType } from './types'

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

const ExportForm = ({
    work,
    generateExport,
    open,
    setOpen,
    mode,
    showFormatting,
    isGenerating
}: ExportFormProps) => {
    const settings = useSettings()
    const { t } = useTranslation()

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

    const form: FormikProps<ExportDataType> = useFormik<ExportDataType>({
        enableReinitialize: true,
        initialValues: {
            author: work.author,
            chapterTitle: t('form.work.export.chapterTitleInitialValue'),
            chapterPosition: 'center',
            sceneSeparator: 'oOo',
            lineHeight: DEFAULT_LINE_HEIGHT,
            paragraphSpacing: DEFAULT_PARAGRAPH_SPACING,
            font: 'arial',
            fontSize: DEFAULT_FONT_SIZE,
            indentParagraph: DEFAULT_INDENT_PARAGRAPH
        },
        validationSchema,
        onSubmit: async (values: ExportDataType) => generateExport(values)
    })

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={() => setOpen(false)}
            TransitionComponent={Transition}>
            <Box component='form' onSubmit={form.handleSubmit}>
                <AppBar
                    sx={{ position: 'relative' }}
                    color='transparent'
                    elevation={0}
                    className='border-b'>
                    <Toolbar>
                        <IconButton
                            edge='start'
                            color='inherit'
                            onClick={() => setOpen(false)}
                            aria-label='close'>
                            {GLOBAL_ICONS.close}
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                            {t('form.work.export.title', { mode })}
                        </Typography>
                        {isGenerating ? (
                            <Typography
                                variant='body2'
                                className='text-slate-600 pr-3 max-w-[300px]'>
                                {t('form.work.export.helpText')}
                            </Typography>
                        ) : null}
                        <Button variant='contained' type='submit' disabled={isGenerating}>
                            {isGenerating ? (
                                <CircularProgress size={settings.appFontSize * 2} />
                            ) : (
                                t('form.work.export.button')
                            )}
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    {showFormatting ? (
                        <Box className='p-5'>
                            <Box className='grid grid-cols-1 gap-3'>
                                <Box className='grid grid-cols-2 gap-3'>
                                    <FontFamilyField
                                        form={form}
                                        name='font'
                                        mode='safe'
                                        label={t('form.work.export.font')}
                                    />
                                    <FontSizeField
                                        form={form}
                                        name='fontSize'
                                        label='form.work.export.fontSize'
                                    />
                                </Box>
                                <LineHeightField
                                    form={form}
                                    name='lineHeight'
                                    label='form.work.export.lineHeight'
                                />
                                <ParagraphSpacingField
                                    form={form}
                                    name='paragraphSpacing'
                                    label='form.work.export.paragraphSpacing'
                                />
                                <SwitchField
                                    form={form}
                                    name='indentParagraph'
                                    label='form.work.export.indentParagraph'
                                />
                            </Box>
                        </Box>
                    ) : null}
                    <Box className='p-5'>
                        <Box className='grid grid-cols-1 gap-5'>
                            <TextField
                                margin='none'
                                label={t('form.work.export.author')}
                                name='author'
                                form={form}
                            />
                            <Box className='grid grid-cols-2 gap-3'>
                                <TextField
                                    label={t('form.work.export.chapterTitle')}
                                    margin='none'
                                    name='chapterTitle'
                                    form={form}
                                />
                                <RadioField
                                    form={form}
                                    label='form.work.export.chapterPosition.label'
                                    name='chapterPosition'
                                    options={[
                                        {
                                            value: 'left',
                                            // eslint-disable-next-line max-len
                                            label: 'form.work.export.chapterPosition.left'
                                        },
                                        {
                                            value: 'center',
                                            // eslint-disable-next-line max-len
                                            label: 'form.work.export.chapterPosition.center'
                                        }
                                    ]}
                                />
                            </Box>
                            <TextField
                                fullWidth={false}
                                label={t('form.work.export.sceneSeparator')}
                                margin='none'
                                name='sceneSeparator'
                                form={form}
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default ExportForm
