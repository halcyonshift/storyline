import { DateTime } from 'luxon'
import { StatusType } from '@sl/constants/status'
import { TabType } from '@sl/layouts/Work/types'

export type LastUpdatedType = {
    date: DateTime
} & TabType

export type RandomCharacterType = {
    name: string
    job: string
    dateOfBirth: string
    traits: string
}

type TimelineItemType = {
    date: DateTime
    items: { label: string; status: StatusType }[]
}

export type TimelineType = TimelineItemType[]

export type DeadlineType = {
    [key: string]: TimelineItemType
}
