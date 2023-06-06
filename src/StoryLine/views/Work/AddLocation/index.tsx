import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { LocationModel, WorkModel } from '@sl/db/models'
import { LocationDataType } from '@sl/db/models/types'
import LocationForm from '@sl/forms/Work/Location'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const AddLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = getInitialValues('item', ['work_id', 'location_id']) as LocationDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        if (location) {
            location.getBreadcrumbs().then((breadcrumbs) => setBreadcrumbs(breadcrumbs))
        } else {
            setBreadcrumbs([])
        }
        setTitle(t('layout.work.panel.location.addLocation'))
    }, [location?.id])

    return <LocationForm work={work} location={location} initialValues={initialValues} />
}

export default AddLocationView
