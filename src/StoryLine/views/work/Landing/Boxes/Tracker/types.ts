import { SectionModel } from '@sl/db/models'

export type SceneListProps = {
    scenes: SectionModel[]
}

export type ChapterListProps = {
    chapters: SectionModel[]
} & SceneListProps

export type PartListProps = {
    parts: SectionModel[]
} & ChapterListProps
