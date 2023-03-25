import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { WorkModel } from '@sl/db/models'

import ItemForm from '@sl/forms/Work/Item'

const AddItemView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()

    return (
        <FormWrapper title={t('view.work.addItem.title')}>
            <ItemForm work={work} />
        </FormWrapper>
    )
}

export default AddItemView
