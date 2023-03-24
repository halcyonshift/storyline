import { MutableRefObject } from 'react'

export type NavigationProps = {
    currentPanel: string | null
    setCurrentPanel: (panel: string | null) => void
    forwardRef: MutableRefObject<HTMLElement>
}

export type TogglePanelType = 'character' | 'item' | 'location' | 'note' | 'search' | 'section'
