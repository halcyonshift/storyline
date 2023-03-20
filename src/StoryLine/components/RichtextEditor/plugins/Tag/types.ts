export type AutocompleteOption = {
    id: string
    label: string
}

export type TagModeType = 'character' | 'location' | 'item' | 'note'

export type TagPayloadType = {
    mode: TagModeType
    id: string
    title: string
}

export type TagMenuProps = {
    menu?: string
    open?: boolean
    menuElement: HTMLElement | null
    setMenu: (menu: string | null) => void
    setMenuElement: (element: HTMLElement | null) => void
}
