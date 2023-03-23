import { SectionModel } from '@sl/db/models'
import { SectionDataType } from '@sl/db/models/types'

export type SceneFormProps = {
    scene: SectionModel
    initialValues: SectionDataType
}
