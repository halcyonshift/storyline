import { useRouteLoaderData } from 'react-router-dom'
import ItemModel from '@sl/db/models/ItemModel'

const ItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel
    return <p>{item.body}</p>
}

export default ItemView
