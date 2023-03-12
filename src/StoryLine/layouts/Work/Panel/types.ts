import { CharacterModel, ItemModel, LocationModel, NoteModel, SectionModel } from '@sl/db/models'
import { TabType } from '../types'

export type PanelType = {
    loadTab: (focusTab: TabType) => void
}

export type CharacterPanelProps = {
    characters: CharacterModel[]
} & PanelType

export type ItemPanelProps = {
    items: ItemModel[]
} & PanelType

export type LocationPanelProps = {
    locations: LocationModel[]
} & PanelType

export type NotePanelProps = {
    notes: NoteModel[]
} & PanelType

export type SectionPanelProps = {
    sections: SectionModel[]
} & PanelType
