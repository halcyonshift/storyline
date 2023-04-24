import { MutableRefObject, ReactNode } from 'react'

export type TabType = {
    id?: string
    label?: string
    link?: string
    mode?: 'character' | 'item' | 'location' | 'note' | 'section'
}

export type TabsDataType = {
    active: number
    tabs: TabType[]
    showTabs: boolean
}

export type TabsProviderProps = {
    children: ReactNode
}

export type TabsContextType = {
    loadTab: (focusTab: TabType, switchTab?: boolean) => void
    removeTab: (id: string) => void
    setActive: (index: number) => void
    setShowTabs: (state: boolean) => void
    setTabs: (tabs: TabType[] | null) => void
} & TabsDataType

export type LayoutContextType = {
    navigationRef: MutableRefObject<HTMLElement>
    panelRef: MutableRefObject<HTMLElement>
    mainRef: MutableRefObject<HTMLElement>
    windowWidth: number
    navigationWidth: number
    panelWidth: number
    setPanelWidth: (width: number) => void
    mainWidth: number
}

export type LayoutProviderProps = {
    navigationRef: MutableRefObject<HTMLElement>
    panelRef: MutableRefObject<HTMLElement>
    mainRef: MutableRefObject<HTMLElement>
    children: ReactNode
}
