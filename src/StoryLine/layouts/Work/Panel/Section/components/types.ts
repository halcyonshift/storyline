import { SectionModel } from '@sl/db/models'

import { TabType } from '../../../types'

export type SceneListProps = {
    scenes: SectionModel[]
    loadTab: (focusTab: TabType) => void
}

export type ChapterAccordionProps = {
    chapters: SectionModel[]
} & SceneListProps

export type PartAccordionProps = {
    parts: SectionModel[]
} & ChapterAccordionProps
