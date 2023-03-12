import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import DateField from '@sl/components/DateField'
import ImageField from '@sl/components/ImageField'
import { NoteDataType } from '@sl/db/models/types'

import { NoteFormProps } from './types'

const ItemForm = ({
    work,
    note,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    character,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    location,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    section,
    initialValues = {
        title: '',
        body: '',
        url: '',
        image: '',
        date: '',
        color: '#000000',
        order: null
    }
}: NoteFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string().required(t('form.note.title.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable(),
        date: yup.string().nullable(),
        color: yup.string().nullable(),
        order: yup.number().min(0).nullable()
    })

    const form: FormikProps<NoteDataType> = useFormik<NoteDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: NoteDataType) => {
            if (initialValues.title) {
                note.updateNote(values)
                navigate(`/works/${note.work.id}/note/${note.id}`)
            } else {
                const newNote = note ? await note.addNote(values) : await work.addNote(values)

                form.resetForm()
                navigate(`/works/${work.id}/note/${newNote.id}`)
            }
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label={t('form.work.note.title.label')}
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
                id='body'
                label={t('form.work.note.body')}
                name='body'
                fullWidth
                multiline
                variant='standard'
                spellCheck={true}
                value={form.values.body}
                onChange={form.handleChange}
                error={form.touched.body && Boolean(form.errors.body)}
                helperText={form.touched.body && form.errors.body}
            />
            <TextField
                margin='dense'
                id='url'
                label={t('form.work.note.url')}
                name='url'
                fullWidth
                variant='standard'
                value={form.values.url}
                onChange={form.handleChange}
                error={form.touched.url && Boolean(form.errors.url)}
                helperText={form.touched.url && form.errors.url}
            />
            <TextField
                margin='dense'
                id='color'
                label={t('form.work.note.color')}
                name='color'
                fullWidth
                type='color'
                variant='standard'
                value={form.values.color}
                onChange={form.handleChange}
                error={form.touched.color && Boolean(form.errors.color)}
                helperText={form.touched.color && form.errors.color}
            />
            <ImageField label={t('form.work.note.image')} form={form} dir='notes' />
            <DateField form={form} />
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t(
                        initialValues.title
                            ? 'form.work.note.button.update'
                            : 'form.work.note.button.create'
                    )}
                </Button>
            </Box>
        </Stack>
    )
}

export default ItemForm
