import { Box, Button, MenuItem, Stack, TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import ImageField from '@sl/components/ImageField'
import TextareaField from '@sl/components/TextareaField'
import TextField from '@sl/components/TextField'
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'
import { WorkDataType } from '@sl/db/models/types'
import { WorkFormProps } from './types'

const WorkForm = ({
    work,
    initialValues = {
        title: '',
        author: '',
        summary: '',
        image: '',
        language: 'en-gb',
        wordGoal: null,
        deadlineAt: null
    }
}: WorkFormProps) => {
    const database = useDatabase()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string().required(t('form.work.work.title.required')),
        author: yup.string().nullable(),
        language: yup.string(),
        image: yup.string().nullable(),
        summary: yup.string().nullable(),
        wordGoal: yup.number().nullable(),
        deadlineAt: yup.date().nullable()
    })

    const form: FormikProps<WorkDataType> = useFormik<WorkDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: WorkDataType) => {
            if (initialValues.title) {
                await work.updateWork(values)
            } else {
                work = await database.write(async () => {
                    return await database.get<WorkModel>('work').create((work) => {
                        work.title = values.title
                        work.author = values.author
                        work.language = values.language
                        work.status = Status.TODO
                    })
                })

                const part = await work.addPart()
                const chapter = await part.addChapter()
                await chapter.addScene()
                form.resetForm()
            }

            navigate(`/works/${work.id}`)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField autoFocus form={form} label={t('form.work.work.title.label')} name='title' />
            <TextField label={t('form.work.work.author')} name='author' form={form} />
            <TextField select form={form} name='language' label={t('form.work.work.language')}>
                <MenuItem value='en-gb'>English (UK)</MenuItem>
                <MenuItem value='en-us'>English (US)</MenuItem>
                <MenuItem value='en-au'>English (Australian)</MenuItem>
            </TextField>
            {initialValues.title ? (
                <>
                    <TextareaField
                        form={form}
                        fieldName='summary'
                        label={t('form.work.work.summary')}
                    />
                    <TextField
                        form={form}
                        label={t('form.work.work.wordGoal')}
                        name='wordGoal'
                        type='number'
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                    <ImageField form={form} label={t('form.work.work.image')} dir='works' />
                    <DatePicker
                        label={t('form.work.work.deadline')}
                        inputFormat='d/M/yyyy'
                        disableMaskedInput
                        value={form.values.deadlineAt}
                        onChange={(newValue: DateTime | null) => {
                            form.setFieldValue('deadlineAt', newValue ? newValue.toJSDate() : null)
                        }}
                        renderInput={(params) => <MuiTextField margin='dense' {...params} />}
                    />
                </>
            ) : null}
            <Box className='text-center'>
                <Button type='submit' variant='contained'>
                    {t(
                        initialValues.title
                            ? 'form.work.work.button.update'
                            : 'form.work.work.button.create'
                    )}
                </Button>
            </Box>
        </Stack>
    )
}

export default WorkForm
