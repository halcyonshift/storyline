export type RichtextEditorProps = {
    id: string
    initialValue: string
    onSave?: (value: string) => Promise<void>
    onChange?: (value: string) => void
    toolbar?: string[]
}

export type MenuProps = {
    menu?: string
    open?: boolean
    menuElement: HTMLElement | null
    setMenu: (menu: string | null) => void
    setMenuElement: (element: HTMLElement | null) => void
}
