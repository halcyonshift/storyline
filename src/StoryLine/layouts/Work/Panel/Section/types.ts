import { SectionModel } from '@sl/db/models'

export type SceneListProps = {
    startIndex?: number
    scenes: SectionModel[]
}

export type ChapterAccordionProps = {
    chapters: SectionModel[]
} & SceneListProps

export type PartAccordionProps = {
    parts: SectionModel[]
} & ChapterAccordionProps
