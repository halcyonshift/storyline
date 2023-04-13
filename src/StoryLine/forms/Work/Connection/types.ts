import { ConnectionModel, WorkModel } from '@sl/db/models'
import { ConnectionDataType } from '@sl/db/models/types'

export type ConnectionFormProps = {
    work?: WorkModel
    connection?: ConnectionModel
    initialValues?: ConnectionDataType
    setOpen: (state: boolean) => void
}
