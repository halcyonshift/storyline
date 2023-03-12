import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import LocationModel from '@sl/db/models/LocationModel'
import useTabs from '@sl/layouts/Work/useTabs'

const LocationView = () => {
    const tabs = useTabs()
    const location = useRouteLoaderData('location') as LocationModel

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return <p>{location.displayName}</p>
}

export default LocationView
