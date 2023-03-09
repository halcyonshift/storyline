import { ItemModel, WorkModel } from '@sl/db/models'
import { ItemDataType } from '@sl/db/models/types'

export type ItemFormProps = {
    work?: WorkModel
    item?: ItemModel
    initialValues?: ItemDataType
}
