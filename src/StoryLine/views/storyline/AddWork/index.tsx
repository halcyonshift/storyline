import { WorkDataType } from '@sl/db/models/types'
import WorkForm from '@sl/forms/Work/Work'
import { getInitialValues } from '@sl/forms/Work/utils'

const AddWorkView = () => {
    const initialValues = getInitialValues('work') as WorkDataType
    return <WorkForm initialValues={initialValues} />
}

export default AddWorkView
