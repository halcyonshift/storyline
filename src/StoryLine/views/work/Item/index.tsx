import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import ItemModel from '@sl/db/models/LocationModel'
import useTabs from '@sl/layouts/Work/useTabs'

const ItemView = () => {
    const tabs = useTabs()
    const location = useRouteLoaderData('item') as ItemModel

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return <p>{location.body}</p>
}

export default ItemView
