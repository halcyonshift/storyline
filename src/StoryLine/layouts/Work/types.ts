import { MutableRefObject, ReactNode } from 'react'

import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

export type TabbedWorkLayoutProps = {
    characters: CharacterModel[]
    items: ItemModel[]
    locations: LocationModel[]
    notes: NoteModel[]
    sections: SectionModel[]
    work: WorkModel
}

export type TabType = {
    id: string
    label: string
    link: string
}

export type TabsDataType = {
    active: number
    tabs: TabType[]
    showTabs: boolean
}

export type TabsProviderProps = {
    children: ReactNode
} & TabbedWorkLayoutProps

export type TabsContextType = {
    loadTab: (focusTab: TabType, switchTab?: boolean) => void
    removeTab: (id: string) => void
    setActive: (index: number) => void
    setShowTabs: (state: boolean) => void
    setTabs: (tabs: TabType[] | null) => void
} & TabsDataType &
    TabbedWorkLayoutProps

export type LayoutContextType = {
    navigationRef: MutableRefObject<HTMLElement>
    panelRef: MutableRefObject<HTMLElement>
    mainRef: MutableRefObject<HTMLElement>
    width: number
    navigation: number
    panel: number
    setPanel: (width: number) => void
    main: number
}

export type LayoutProviderProps = {
    navigationRef: MutableRefObject<HTMLElement>
    panelRef: MutableRefObject<HTMLElement>
    mainRef: MutableRefObject<HTMLElement>
    children: ReactNode
}
