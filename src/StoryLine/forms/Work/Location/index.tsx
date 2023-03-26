import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import MapField from '@sl/components/form/MapField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { LocationDataType } from '@sl/db/models/types'
import ImageField from '@sl/components/form/ImageField'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import { LocationFormProps } from './types'

const LocationForm = ({ work, location, initialValues }: LocationFormProps) => {
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

    const getTitle = (): string => {
        if (location?.displayName && !initialValues.name) {
            return `${location.displayName}: ${t('layout.work.panel.location.add')}`
        }

        return location?.displayName || t('layout.work.panel.location.add')
    }

    return (
        <FormWrapper
            form={form}
            title={getTitle()}
            model={location}
            tabList={[t('component.formWrapper.tab.general')]}>
            <Box className='grid grid-cols-2 gap-3 px-3 py-1'>
                {!isOnline ? <Alert severity='warning'>{t('error.connection')}</Alert> : null}
                <TextField
                    autoFocus
                    label={t('form.work.location.name.label')}
                    name='name'
                    form={form}
                />
                <TextareaField fieldName='body' form={form}></TextareaField>
                <TextField label={t('form.work.location.url')} name='url' form={form} />
                <Box className='grid grid-cols-2 gap-4'>
                    <Box>
                        <MapField form={form} />
                    </Box>
                    <Box>
                        <ImageField form={form} dir='locations' />
                    </Box>
                </Box>
            </Box>
            <></>
        </FormWrapper>
    )
}

export default LocationForm
