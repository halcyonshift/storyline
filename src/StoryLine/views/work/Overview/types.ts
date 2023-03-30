import { DateTime } from 'luxon'
import { CharacterModel, ItemModel, LocationModel, SectionModel, WorkModel } from '@sl/db/models'

export type DateObject = {
    [key: string]: number
}

export type OverviewSummaryProps = {
    parts: SectionModel[]
    chapters: SectionModel[]
    scenes: SectionModel[]
}

export type OverviewTimelineProps = {
    work: WorkModel
}

export type TimelineItemType = {
    id: string
    title: string
    text: string
    sortDate: number
    date: DateTime
    character: CharacterModel | null
    item: ItemModel | null
    location: LocationModel | null
}

export type TimelineType = {
    date: DateTime
    items: TimelineItemType[]
}

export type TimelineGroupType = {
    [key: string]: TimelineType
}
