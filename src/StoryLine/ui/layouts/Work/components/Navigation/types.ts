import { WorkModel } from '../../../../../db/models'

export type NavigationProps = {
    work: WorkModel
    currentPanel: string | null
    setCurrentPanel: (panel: string | null) => void
}
