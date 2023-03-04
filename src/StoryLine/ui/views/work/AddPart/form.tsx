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

import DateField from '../../../components/DateField'
import { WorkModel } from '../../../../db/models'
import { SectionDataType } from '../../../../db/models/types'

const Form = ({ work }: { work: WorkModel }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string(),
        description: yup.string(),
        date: yup.string().nullable(),
        order: yup.number().positive().integer().nullable(),
        words: yup.number().positive().integer().nullable(),
        deadlineAt: yup.date().nullable()
    })

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        initialValues: {
            title: '',
            description: '',
            date: null,
            order: 2,
            words: 0,
            deadlineAt: null
        },
        validationSchema: validationSchema,
        onSubmit: async (values: SectionDataType) => {
            await work.addPart(values)
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
                    id='words'
                    label={t('view.work.addPart.form.wordGoal')}
                    name='words'
                    type='number'
                    value={form.values.words}
                    onChange={form.handleChange}
                    error={form.touched.words && Boolean(form.errors.words)}
                    helperText={form.touched.words && form.errors.words}
                    InputProps={{ inputProps: { min: 0, step: 100 } }}
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
