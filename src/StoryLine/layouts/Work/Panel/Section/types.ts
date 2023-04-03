import { SectionModel } from '@sl/db/models'

export type SceneListProps = {
    scenes: SectionModel[]
}

export type ChapterAccordionProps = {
    chapters: SectionModel[]
} & SceneListProps

export type PartAccordionProps = {
    parts: SectionModel[]
} & ChapterAccordionProps
