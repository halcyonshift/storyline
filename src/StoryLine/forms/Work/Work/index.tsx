import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { WorkModel } from '@sl/db/models'
import { WorkDataType } from '@sl/db/models/types'
import { WorkFormProps } from './types'

// eslint-disable-next-line complexity
const WorkForm = ({
    work,
    initialValues = {
        title: '',
        author: '',
        summary: '',
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
        author: yup.string(),
        language: yup.string(),
        summary: yup.string(),
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
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label={t('form.work.work.title.label')}
                name='title'
                fullWidth
                variant='standard'
                value={form.values.title}
                onChange={form.handleChange}
                error={form.touched.title && Boolean(form.errors.title)}
                helperText={form.touched.title && form.errors.title}
            />
            <TextField
                margin='dense'
                id='author'
                label={t('form.work.work.author')}
                name='author'
                fullWidth
                variant='standard'
                value={form.values.author}
                onChange={form.handleChange}
                error={form.touched.author && Boolean(form.errors.author)}
                helperText={form.touched.author && form.errors.author}
            />
            <TextField
                select
                margin='dense'
                fullWidth
                variant='standard'
                id='language'
                name='language'
                label={t('form.work.work.language')}
                value={form.values.language}
                onChange={form.handleChange}>
                <MenuItem value='en-gb'>English (UK)</MenuItem>
                <MenuItem value='en-us'>English (US)</MenuItem>
                <MenuItem value='en-au'>English (Australian)</MenuItem>
            </TextField>
            {initialValues.title ? (
                <>
                    <TextField
                        margin='dense'
                        id='summary'
                        label={t('form.work.work.summary')}
                        name='summary'
                        variant='standard'
                        multiline
                        value={form.values.summary || ''}
                        onChange={form.handleChange}
                        error={form.touched.summary && Boolean(form.errors.summary)}
                        helperText={form.touched.summary && form.errors.summary}
                    />
                    <TextField
                        margin='dense'
                        id='wordGoal'
                        label={t('form.work.work.wordGoal')}
                        name='wordGoal'
                        variant='standard'
                        type='number'
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                        value={form.values.wordGoal}
                        onChange={form.handleChange}
                        error={form.touched.wordGoal && Boolean(form.errors.wordGoal)}
                        helperText={form.touched.wordGoal && form.errors.wordGoal}
                    />
                    <DatePicker
                        label={t('form.work.work.deadline')}
                        inputFormat='d/M/yyyy'
                        disableMaskedInput
                        value={form.values.deadlineAt}
                        onChange={(newValue: DateTime | null) => {
                            form.setFieldValue('deadlineAt', newValue ? newValue.toJSDate() : null)
                        }}
                        renderInput={(params) => <TextField {...params} />}
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
