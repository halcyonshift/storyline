import { DateTime } from 'luxon'
import { StatusType } from '@sl/constants/status'
import { TabType } from '@sl/layouts/Work/types'

export type LastUpdatedType = {
    date: DateTime
} & TabType

export type TimelineItemType = {
    date: DateTime
    items: { label: string; status: StatusType }[]
}

export type DeadlineType = {
    [key: string]: TimelineItemType
}
