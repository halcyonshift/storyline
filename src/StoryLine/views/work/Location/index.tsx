import { useRouteLoaderData } from 'react-router-dom'
import LocationModel from '@sl/db/models/LocationModel'

const LocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    return <p>{location.body}</p>
}

export default LocationView
