import WorkModel from '@sl/db/models/WorkModel'
import { WorkDataType } from '@sl/db/models/types'

export type WorkFormProps = {
    work?: WorkModel
    initialValues?: WorkDataType
}
