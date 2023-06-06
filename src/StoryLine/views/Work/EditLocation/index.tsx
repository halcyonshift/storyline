import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import LocationModel from '@sl/db/models/LocationModel'
import { LocationDataType } from '@sl/db/models/types'
import LocationForm from '@sl/forms/Work/Location'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const EditLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const initialValues = Object.keys(
        getInitialValues('location', ['work_id', 'location_id', 'status']) as LocationDataType
    ).reduce(
        (o, key) => ({ ...o, [key]: location[key as keyof LocationModel] }),
        {}
    ) as LocationDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        location.getBreadcrumbs().then((breadcrumbs) => {
            setTitle(t('layout.work.panel.location.edit'))
            setBreadcrumbs(breadcrumbs)
        })
    }, [location.id])

    return <LocationForm location={location} initialValues={initialValues} />
}

export default EditLocationView
