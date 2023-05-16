import { SectionModel, WorkModel } from '@sl/db/models'

export type BlockType = {
    section: SectionModel
    index: number
    fontWeight: number
    group: boolean
}

export type SprintType = {
    work: WorkModel
}
