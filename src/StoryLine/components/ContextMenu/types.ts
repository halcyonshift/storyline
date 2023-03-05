import { ReactElement } from 'react'

export type ContextMenuItemType = {
    label: string
    link: string
    icon?: ReactElement
}

export type ContextMenuProps = {
    children: ReactElement
    items: ContextMenuItemType[]
}
