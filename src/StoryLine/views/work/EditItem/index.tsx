import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import ItemModel from '@sl/db/models/ItemModel'
import ItemForm from '@sl/forms/Work/Item'

const EditItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel

    return (
        <FormWrapper title={item.displayName} model={item}>
            <ItemForm
                item={item}
                initialValues={{
                    name: item.name,
                    body: item.body,
                    url: item.url,
                    image: item.image
                }}
            />
        </FormWrapper>
    )
}

export default EditItemView
