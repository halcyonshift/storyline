import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import ItemModel from '@sl/db/models/ItemModel'
import { ItemDataType } from '@sl/db/models/types'
import ItemForm from '@sl/forms/Work/Item'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const EditItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel
    const initialValues = Object.keys(
        getInitialValues('item', ['work_id', 'status']) as ItemDataType
    ).reduce((o, key) => ({ ...o, [key]: item[key as keyof ItemModel] }), {}) as ItemDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(t('layout.work.panel.item.edit'))
        setBreadcrumbs([
            {
                label: item.displayName,
                tab: { id: item.id, mode: 'item' }
            }
        ])
    }, [item.id])

    return <ItemForm item={item} initialValues={initialValues} />
}

export default EditItemView
