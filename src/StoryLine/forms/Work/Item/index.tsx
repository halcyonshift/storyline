import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { ItemDataType } from '@sl/db/models/types'
import ImageField from '@sl/components/ImageField'

import { ItemFormProps } from './types'

const ItemForm = ({
    work,
    item,
    initialValues = {
        name: '',
        body: '',
        url: '',
        image: ''
    }
}: ItemFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        name: yup.string().required(t('form.item.name.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable()
    })

    const form: FormikProps<ItemDataType> = useFormik<ItemDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: ItemDataType) => {
            if (initialValues.name) {
                await item.updateItem(values)
            } else {
                item = await work.addItem(values)
                form.resetForm()
            }
            navigate(`/works/${item.work.id}/item/${item.id}`)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField
                autoFocus
                margin='dense'
                id='name'
                label={t('form.work.item.name.label')}
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
                label={t('form.work.item.body')}
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
                label={t('form.work.item.url')}
                name='url'
                fullWidth
                variant='standard'
                value={form.values.url}
                onChange={form.handleChange}
                error={form.touched.url && Boolean(form.errors.url)}
                helperText={form.touched.url && form.errors.url}
            />
            <ImageField label={t('form.work.item.image')} form={form} dir='items' />
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t(
                        initialValues.name
                            ? 'form.work.item.button.update'
                            : 'form.work.item.button.create'
                    )}
                </Button>
            </Box>
        </Stack>
    )
}

export default ItemForm
