import { useEffect, useState } from 'react'
import { default as MuiTimeline } from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
    timelineOppositeContentClasses
} from '@mui/lab/TimelineOppositeContent'
import { Typography } from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DateTime } from 'luxon'
import { YYYYMMDD } from '@sl/constants'
import { SectionMode } from '@sl/constants/sectionMode'
import useSettings from '@sl/theme/useSettings'
import { OverviewTimelineProps, TimelineType, TimelineGroupType } from '../types'
import { useTranslation } from 'react-i18next'

const Timeline = ({ work }: OverviewTimelineProps) => {
    const [timeline, setTimeline] = useState<TimelineType[]>([])
    const settings = useSettings()
    const { t } = useTranslation()

    useEffect(() => {
        Promise.all([
            work.character.fetch(),
            work.item.fetch(),
            work.location.fetch(),
            work.note.fetch(),
            work.section.extend(Q.where('mode', Q.notEq(SectionMode.VERSION))).fetch()
        ]).then(([characters, items, locations, notes, sections]) => {
            characters = characters.filter((character) => character.sortDate)
            notes = notes.filter((note) => note.sortDate)
            sections = sections.filter((section) => section.sortDate)

            const _timeline: TimelineGroupType = {}

            notes
                .map((note) => ({
                    id: note.id,
                    title: note.displayName,
                    text: note.body,
                    sortDate: note.sortDate,
                    date: DateTime.fromSQL(note.date),
                    character: characters.find((character) => character.id === note.character.id),
                    item: items.find((item) => item.id === note.item.id),
                    location: locations.find((location) => location.id === note.location.id)
                }))
                .concat(
                    ...sections.map((section) => ({
                        id: section.id,
                        title: section.displayName,
                        text: section.description,
                        sortDate: section.sortDate,
                        date: DateTime.fromSQL(section.date),
                        character: characters.find(
                            (character) => character.id === section.pointOfViewCharacter.id
                        ),
                        item: null,
                        location: null
                    })),
                    ...characters.map((character) => ({
                        id: character.id,
                        title: t('view.work.overview.timeline.character.dob', {
                            name: character.displayName
                        }),
                        text: '',
                        sortDate: character.sortDate,
                        date: DateTime.fromSQL(character.dateOfBirth),
                        character: null,
                        item: null,
                        location: null
                    }))
                )
                .sort((a, b) => a.sortDate - b.sortDate)
                .map((event) => {
                    if (!_timeline[event.date.toFormat(YYYYMMDD)]) {
                        _timeline[event.date.toFormat(YYYYMMDD)] = {
                            date: event.date,
                            items: []
                        }
                    }
                    _timeline[event.date.toFormat(YYYYMMDD)].items.push(event)
                })

            setTimeline(Object.values(_timeline))
        })
    }, [])

    return (
        <MuiTimeline
            position='right'
            sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2
                }
            }}>
            {timeline.map((event) => (
                <TimelineItem key={event.date.toSQL()}>
                    <TimelineOppositeContent color='secondary' fontSize='small'>
                        {event.date.setLocale(settings.language).toLocaleString(DateTime.DATE_MED)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color='primary' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        {event.items.map((item) => (
                            <Typography key={item.id} variant='body1'>
                                {item.date.toLocaleString(DateTime.TIME_SIMPLE)} {item.title}
                            </Typography>
                        ))}
                    </TimelineContent>
                </TimelineItem>
            ))}
        </MuiTimeline>
    )
}

export default Timeline
