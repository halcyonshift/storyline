export type RichtextEditorProps = {
    id: string
    onSave: (value: string) => Promise<void>
    initialValue: string
}

export type MenuProps = {
    menu?: string
    open?: boolean
    menuElement: HTMLElement | null
    setMenu: (menu: string | null) => void
    setMenuElement: (element: HTMLElement | null) => void
}
