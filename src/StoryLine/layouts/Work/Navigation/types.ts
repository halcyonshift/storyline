import { MutableRefObject } from 'react'
import { WorkModel } from '@sl/db/models'

export type NavigationProps = {
    work: WorkModel
    currentPanel: string | null
    setCurrentPanel: (panel: string | null) => void
    forwardRef: MutableRefObject<HTMLElement>
}

export type TogglePanelType = 'character' | 'item' | 'location' | 'note' | 'search' | 'section'
