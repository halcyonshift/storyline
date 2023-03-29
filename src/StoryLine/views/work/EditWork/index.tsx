import { useRouteLoaderData } from 'react-router-dom'
import WorkModel from '@sl/db/models/WorkModel'
import { WorkDataType } from '@sl/db/models/types'
import WorkForm from '@sl/forms/Work/Work'
import { getInitialValues } from '@sl/forms/Work/utils'

const EditWorkView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = Object.keys(getInitialValues('work') as WorkDataType).reduce(
        (o, key) => ({ ...o, [key]: work[key as keyof WorkModel] }),
        {}
    ) as WorkDataType

    return <WorkForm work={work} initialValues={initialValues} />
}

export default EditWorkView
