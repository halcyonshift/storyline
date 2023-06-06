import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import WorkModel from '@sl/db/models/WorkModel'
import { WorkDataType } from '@sl/db/models/types'
import WorkForm from '@sl/forms/Work/Work'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const EditWorkView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = Object.keys(getInitialValues('work', ['status']) as WorkDataType).reduce(
        (o, key) => ({ ...o, [key]: work[key as keyof WorkModel] }),
        {}
    ) as WorkDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(t('layout.work.navigation.setting'))
        setBreadcrumbs([])
    }, [work.id])

    return <WorkForm work={work} initialValues={initialValues} />
}

export default EditWorkView
