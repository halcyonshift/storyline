import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import DateField from '@sl/components/form/DateField'
import { WorkModel } from '@sl/db/models'
import { SectionDataType } from '@sl/db/models/types'

const Form = ({ work }: { work: WorkModel }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string(),
        description: yup.string(),
        date: yup.string().nullable(),
        wordGoal: yup.number().positive().integer().nullable(),
        deadlineAt: yup.date().nullable()
    })

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        initialValues: {
            title: '',
            description: '',
            date: null,
            wordGoal: 0,
            deadlineAt: null
        },
        validationSchema: validationSchema,
        onSubmit: async (values: SectionDataType) => {
            const partsCount = await work.parts.fetchCount()
            values.order = partsCount + 1
            await work.addPart()
            form.resetForm()
            navigate(`/works/${work.id}`)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label={t('view.work.addPart.form.title')}
                name='title'
                fullWidth
                variant='standard'
                value={form.values.title}
                onChange={form.handleChange}
                error={form.touched.title && Boolean(form.errors.title)}
                helperText={form.touched.title && form.errors.title}
            />
            <GrammarlyEditorPlugin clientId='client_PJGNpq8df12athMYk8jcSr'>
                <TextField
                    margin='dense'
                    id='description'
                    label={t('view.work.addPart.form.description')}
                    name='description'
                    fullWidth
                    multiline
                    variant='standard'
                    spellCheck={true}
                    value={form.values.description}
                    onChange={form.handleChange}
                    error={form.touched.description && Boolean(form.errors.description)}
                    helperText={form.touched.description && form.errors.description}
                />
            </GrammarlyEditorPlugin>
            <DateField form={form} />
            <Stack direction='row' spacing={2}>
                <TextField
                    id='wordGoal'
                    label={t('view.work.addPart.form.wordGoal')}
                    name='wordGoal'
                    type='number'
                    value={form.values.wordGoal}
                    onChange={form.handleChange}
                    error={form.touched.wordGoal && Boolean(form.errors.wordGoal)}
                    helperText={form.touched.wordGoal && form.errors.wordGoal}
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
                <DatePicker
                    label={t('view.work.addPart.form.deadline')}
                    inputFormat='d/M/yyyy'
                    disableMaskedInput
                    value={form.values.deadlineAt}
                    onChange={(newValue: DateTime | null) => {
                        form.setFieldValue('deadlineAt', newValue ? newValue.toJSDate() : null)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('view.work.addPart.form.create')}
                </Button>
            </Box>
        </Stack>
    )
}

export default Form
