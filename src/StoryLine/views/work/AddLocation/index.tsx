import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { LocationModel, WorkModel } from '@sl/db/models'

import LocationForm from '@sl/forms/Work/Location'

const AddLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()

    return (
        <FormWrapper
            title={
                location
                    ? `${location.displayName}: ${t('view.work.addLocation.title')}`
                    : t('view.work.addLocation.title')
            }>
            <LocationForm work={work} location={location} />
        </FormWrapper>
    )
}

export default AddLocationView
