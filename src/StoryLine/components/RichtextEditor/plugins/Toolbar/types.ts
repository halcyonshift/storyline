export type ToolbarPluginProps = {
    menu: string | null
    setMenu: (menu: string | null) => void
    setMenuElement: (element: HTMLElement | null) => void
}
