import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { WorkModel } from '@sl/db/models'
import { LocationDataType } from '@sl/db/models/types'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import MapField from '@sl/components/MapField'

const Form = ({ work }: { work: WorkModel }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isOnline = useOnlineStatus()

    const validationSchema = yup.object({
        name: yup.string().required(t('view.work.addLocation.form.required.name')),
        body: yup.string(),
        latitude: yup.string(),
        longitude: yup.string(),
        url: yup.string(),
        image: yup.string()
    })

    const form: FormikProps<LocationDataType> = useFormik<LocationDataType>({
        initialValues: {
            name: '',
            body: '',
            latitude: '',
            longitude: '',
            url: '',
            image: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values: LocationDataType) => {
            const location = await work.addLocation(values)
            form.resetForm()
            navigate(`/works/${work.id}/location/${location.id}`)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            {!isOnline ? <Alert severity='warning'>{t('error.connection')}</Alert> : null}
            <TextField
                autoFocus
                margin='dense'
                id='name'
                label={t('view.work.addLocation.form.name')}
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
                label={t('view.work.addLocation.form.body')}
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
            <MapField form={form} />
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('view.work.addLocation.form.create')}
                </Button>
            </Box>
        </Stack>
    )
}

export default Form
