import { useRouteLoaderData } from 'react-router-dom'
import LocationModel from '@sl/db/models/LocationModel'
import { LocationDataType } from '@sl/db/models/types'
import LocationForm from '@sl/forms/Work/Location'
import { getInitialValues } from '@sl/forms/Work/utils'

const EditLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const initialValues = Object.keys(
        getInitialValues('location', ['work_id', 'location_id', 'status']) as LocationDataType
    ).reduce(
        (o, key) => ({ ...o, [key]: location[key as keyof LocationModel] }),
        {}
    ) as LocationDataType

    return <LocationForm location={location} initialValues={initialValues} />
}

export default EditLocationView
