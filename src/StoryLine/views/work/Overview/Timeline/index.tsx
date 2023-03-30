import { useEffect, useState } from 'react'
import { default as MuiTimeline } from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import { Typography } from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DateTime } from 'luxon'
import { SectionMode } from '@sl/constants/sectionMode'

import { OverviewTimelineProps, TimelineItemTypes } from '../types'
import useSettings from '@sl/theme/useSettings'

const Timeline = ({ work }: OverviewTimelineProps) => {
    const [timeline, setTimeline] = useState<TimelineItemTypes[]>([])
    const settings = useSettings()

    useEffect(() => {
        Promise.all([
            work.character.fetch(),
            work.item.fetch(),
            work.location.fetch(),
            work.note.fetch(),
            work.section.extend(Q.where('mode', Q.notEq(SectionMode.VERSION))).fetch()
        ]).then(([characters, items, locations, notes, sections]) => {
            notes = notes.filter((note) => note.sortDate)
            sections = sections.filter((section) => section.sortDate)

            setTimeline(
                notes
                    .map((note) => ({
                        title: note.displayName,
                        text: note.body,
                        sortDate: note.sortDate,
                        date: DateTime.fromSQL(note.date),
                        character: characters.find(
                            (character) => character.id === note.character.id
                        ),
                        item: items.find((item) => item.id === note.item.id),
                        location: locations.find((location) => location.id === note.location.id)
                    }))
                    .concat(
                        sections.map((section) => ({
                            title: section.displayName,
                            text: section.description,
                            sortDate: section.sortDate,
                            date: DateTime.fromSQL(section.date),
                            character: characters.find(
                                (character) => character.id === section.pointOfViewCharacter.id
                            ),
                            item: null,
                            location: null
                        }))
                    )
                    .sort((a, b) => a.sortDate - b.sortDate)
            )
        })
    }, [])

    return (
        <MuiTimeline position='right'>
            {timeline.map((item) => (
                <TimelineItem key={item.date.toSQL()}>
                    <TimelineOppositeContent color='secondary' fontSize='small'>
                        {item.date.setLocale(settings.language).toLocaleString(DateTime.DATE_MED)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color='primary' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant='body1'>{item.title}</Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </MuiTimeline>
    )
}

export default Timeline
