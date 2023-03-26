import { useRouteLoaderData } from 'react-router-dom'
import { LocationModel, WorkModel } from '@sl/db/models'
import { LocationDataType } from '@sl/db/models/types'
import LocationForm from '@sl/forms/Work/Location'
import { getInitialValues } from '@sl/forms/Work/utils'

const AddLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = getInitialValues('item', ['work_id', 'location_id']) as LocationDataType

    return <LocationForm work={work} location={location} initialValues={initialValues} />
}

export default AddLocationView
