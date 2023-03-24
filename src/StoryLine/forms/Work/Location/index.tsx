import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { LocationDataType } from '@sl/db/models/types'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import ImageField from '@sl/components/form/ImageField'
import MapField from '@sl/components/form/MapField'

import { LocationFormProps } from './types'

const LocationForm = ({
    location,
    work,
    initialValues = {
        name: '',
        body: '',
        latitude: '',
        longitude: '',
        url: '',
        image: ''
    }
}: LocationFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isOnline = useOnlineStatus()

    const validationSchema = yup.object({
        name: yup.string().required(t('form.work.location.name.required')),
        body: yup.string().nullable(),
        latitude: yup.number().nullable(),
        longitude: yup.number().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable()
    })

    const form: FormikProps<LocationDataType> = useFormik<LocationDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: LocationDataType) => {
            if (initialValues.name) {
                location.updateLocation(values)
                navigate(`/works/${location.work.id}/location/${location.id}`)
            } else {
                const newLocation = location
                    ? await location.addLocation(values)
                    : await work.addLocation(values)

                form.resetForm()
                navigate(`/works/${work.id}/location/${newLocation.id}`)
            }
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            {!isOnline ? <Alert severity='warning'>{t('error.connection')}</Alert> : null}
            <TextField
                autoFocus
                margin='dense'
                id='name'
                label={t('form.work.location.name.label')}
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
                label={t('form.work.location.body')}
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
                label={t('form.work.location.url')}
                name='url'
                fullWidth
                variant='standard'
                value={form.values.url}
                onChange={form.handleChange}
                error={form.touched.url && Boolean(form.errors.url)}
                helperText={form.touched.url && form.errors.url}
            />
            <MapField label={t('form.work.location.location')} form={form} />
            <ImageField label={t('form.work.location.image')} form={form} dir='locations' />
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t(
                        initialValues.name
                            ? 'form.work.location.button.update'
                            : 'form.work.location.button.create'
                    )}
                </Button>
            </Box>
        </Stack>
    )
}

export default LocationForm
