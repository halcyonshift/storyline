import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import { ItemDataType } from '@sl/db/models/types'
import ItemForm from '@sl/forms/Work/Item'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const AddItemView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = getInitialValues('item', ['work_id']) as ItemDataType
    const { setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(t('layout.work.panel.item.addItem'))
    }, [])

    return <ItemForm work={work} initialValues={initialValues} />
}

export default AddItemView
