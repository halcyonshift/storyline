import { WorkModel } from '@sl/db/models'

export type TimeLineValuesType = {
    character: string
    note: string
    scene: string
}

export type TimelineFormProps = {
    work: WorkModel
    table: string
    setAnchorEl: (value: null) => void
    setTable: (id: string) => void
    setId: (id: string) => void
}
