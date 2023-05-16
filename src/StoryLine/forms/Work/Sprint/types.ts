import { WorkModel } from '@sl/db/models'

export type SprintFormProps = {
    work: WorkModel
    setDialogOpen: (state: boolean) => void
}
