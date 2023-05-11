import { SectionModel } from '@sl/db/models'

export type BlockType = {
    section: SectionModel
    index: number
    fontWeight: number
    group: boolean
}
