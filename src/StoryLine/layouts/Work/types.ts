import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

export type WorkLayoutProps = {
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
