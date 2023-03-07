import { WorkModel } from '@sl/db/models'

export type NavigationProps = {
    work: WorkModel
    currentPanel: string | null
    setCurrentPanel: (panel: string | null) => void
}

export type TogglePanelType = 'character' | 'item' | 'location' | 'note' | 'search' | 'section'
