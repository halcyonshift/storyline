import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { NoteDataType } from '@sl/db/models/types'
import ImageField from '@sl/components/ImageField'

import { NoteFormProps } from './types'

const ItemForm = ({
    work,
    note,
    character,
    item,
    location,
    section,
    initialValues = {
        title: '',
        body: '',
        url: '',
        image: '',
        date: ''
    }
}: NoteFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string().required(t('form.note.title.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable(),
        date: yup.string().nullable()
    })

    const form: FormikProps<NoteDataType> = useFormik<NoteDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: NoteDataType) => {
            if (initialValues.title) {
                //
            } else {
                //
                form.resetForm()
            }
            navigate(`/works/${note.work.id}/note/${note.id}`)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField
                autoFocus
                margin='dense'
                id='name'
                label={t('form.item.name.label')}
                name='name'
                fullWidth
                variant='standard'
                value={form.values.name}
                onChange={form.handleChange}
                error={form.touched.name && Boolean(form.errors.name)}
                helperText={form.touched.name && form.errors.name}
            />
            <TextField
                margin='dense'
                id='body'
                label={t('form.item.body')}
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
                label={t('form.item.url')}
                name='url'
                fullWidth
                variant='standard'
                value={form.values.url}
                onChange={form.handleChange}
                error={form.touched.url && Boolean(form.errors.url)}
                helperText={form.touched.url && form.errors.url}
            />
            <ImageField label={t('form.item.image')} form={form} dir='items' />
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t(initialValues.name ? 'form.item.button.update' : 'form.item.button.create')}
                </Button>
            </Box>
        </Stack>
    )
}

export default ItemForm
