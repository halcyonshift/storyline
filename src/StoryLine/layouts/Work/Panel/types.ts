import { CharacterModel, ItemModel, LocationModel, NoteModel, SectionModel } from '@sl/db/models'

export type CharacterPanelProps = {
    characters: CharacterModel[]
}

export type ItemPanelProps = {
    items: ItemModel[]
}

export type LocationPanelProps = {
    locations: LocationModel[]
}

export type NotePanelProps = {
    notes: NoteModel[]
}

export type SectionPanelProps = {
    sections: SectionModel[]
}
