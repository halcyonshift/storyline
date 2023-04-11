import { ImageType } from '@sl/components/Gallery/types'
import { NoteModel, SectionModel } from '@sl/db/models'

export type NotesPanelProps = {
    notes: NoteModel[]
}

export type ImagesPanelProps = {
    images: ImageType[]
}

export type LinksPanelProps = {
    links: string[]
}

export type AppearancesPanelProps = {
    appearances: {
        scene: SectionModel
        text: string[]
    }[]
}
