import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import ItemModel from '@sl/db/models/ItemModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const ItemView = () => {
    const tabs = useTabs()
    const item = useRouteLoaderData('item') as ItemModel

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return <p>{item.body}</p>
}

export default ItemView
