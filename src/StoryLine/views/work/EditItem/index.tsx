import { useRouteLoaderData } from 'react-router-dom'
import ItemModel from '@sl/db/models/ItemModel'
import { ItemDataType } from '@sl/db/models/types'
import ItemForm from '@sl/forms/Work/Item'
import { getInitialValues } from '@sl/forms/Work/utils'

const EditItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel
    const initialValues = Object.keys(getInitialValues('item', ['work_id']) as ItemDataType).reduce(
        (o, key) => ({ ...o, [key]: item[key as keyof ItemModel] }),
        {}
    ) as ItemDataType

    return <ItemForm item={item} initialValues={initialValues} />
}

export default EditItemView
