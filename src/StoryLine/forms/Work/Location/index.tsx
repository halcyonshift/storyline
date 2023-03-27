import { useEffect, useState } from 'react'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import { LocationDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import * as Panels from './TabPanel'
import { LocationFormProps } from './types'

const LocationForm = ({ work, location, initialValues }: LocationFormProps) => {
    const [locationCount, setLocationCount] = useState<number>(0)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const messenger = useMessenger()

    const validationSchema = yup.object({
        name: yup.string().required(t('form.work.location.name.required')),
        body: yup.string().nullable(),
        latitude: yup.number().nullable(),
        longitude: yup.number().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable()
    })

    const form: FormikProps<LocationDataType> = useFormik<LocationDataType>({
        enableReinitialize: true,
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
                messenger.success(t('form.work.location.alert.success'))
                if (location) {
                    navigate(`/works/${work.id}/location/${location.id}/edit`)
                } else {
                    navigate(`/works/${work.id}/location/${newLocation.id}/edit`)
                }
            }
        }
    })

    const getTitle = (): string => {
        if (location?.displayName && !initialValues.name) {
            return `${location.displayName}: ${t('layout.work.panel.location.add')}`
        }

        return location?.displayName || t('layout.work.panel.location.add')
    }

    useEffect(() => {
        if (!location?.id) return
        location.locations.fetchCount().then((count) => setLocationCount(count))
    }, [location?.id])

    return (
        <FormWrapper
            form={form}
            title={getTitle()}
            model={location}
            tabList={
                locationCount
                    ? [
                          t('component.formWrapper.tab.general'),
                          t('form.work.location.tab.locations')
                      ]
                    : [t('component.formWrapper.tab.general')]
            }>
            <Panels.General form={form} />
            {locationCount ? (
                <Panels.Locations padding={false} showButton={false} location={location} />
            ) : null}
        </FormWrapper>
    )
}

export default LocationForm
