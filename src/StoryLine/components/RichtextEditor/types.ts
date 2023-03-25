import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'

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
    characters?: CharacterModel[]
    items?: ItemModel[]
    locations?: LocationModel[]
    notes?: NoteModel[]
}
