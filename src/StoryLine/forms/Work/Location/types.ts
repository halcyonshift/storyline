import { LocationModel, WorkModel } from '@sl/db/models'
import { LocationDataType } from '@sl/db/models/types'

export type LocationFormProps = {
    location?: LocationModel
    work?: WorkModel
    initialValues?: LocationDataType
}
