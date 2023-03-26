import { SectionModel, WorkModel } from '@sl/db/models'
import { SectionDataType } from '@sl/db/models/types'

export type SectionFormProps = {
    work: WorkModel
    section: SectionModel
    initialValues: SectionDataType
}
