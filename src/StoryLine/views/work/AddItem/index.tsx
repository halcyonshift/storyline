import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import { ItemDataType } from '@sl/db/models/types'
import ItemForm from '@sl/forms/Work/Item'
import { getInitialValues } from '@sl/forms/Work/utils'

const AddItemView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = getInitialValues('item', ['work_id']) as ItemDataType

    return <ItemForm work={work} initialValues={initialValues} />
}

export default AddItemView
