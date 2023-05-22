import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Typography from '@mui/material/Typography'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { YYYYMMDD } from '@sl/constants'
import { WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import { TimelineItemType, DeadlineType } from '../types'
import { status } from '@sl/theme/utils'

const DeadlinesBox = () => {
    const [timeline, setTimeline] = useState<TimelineItemType[]>([])
    const work = useRouteLoaderData('work') as WorkModel
    const settings = useSettings()
    const { t } = useTranslation()

    useEffect(() => {
        const _deadlines: DeadlineType = {}
        if (work.deadlineAt) {
            const date = DateTime.fromJSDate(work.deadlineAt)
            _deadlines[date.toFormat(YYYYMMDD)] = {
                date,
                items: [{ label: work.title, status: work.status }]
            }
        }
        work.section
            .extend(
                Q.where('deadline_at', Q.gte(DateTime.now().toMillis())),
                Q.sortBy('order', Q.asc)
            )
            .fetch()
            .then((sections) => {
                sections.map((section) => {
                    const date = DateTime.fromJSDate(section.deadlineAt).endOf('day')
                    if (!_deadlines[date.toFormat(YYYYMMDD)]) {
                        _deadlines[date.toFormat(YYYYMMDD)] = {
                            date,
                            items: []
                        }
                    }
                    _deadlines[date.toFormat(YYYYMMDD)].items.push({
                        label: section.displayTitle,
                        status: section.status
                    })
                })
                setTimeline(
                    Object.values(_deadlines).sort((a, b) => a.date.toMillis() - b.date.toMillis())
                )
            })
    }, [])

    return timeline.length ? (
        <Box>
            <Timeline position='right'>
                {timeline.map((deadline) => (
                    <TimelineItem key={deadline.date.toSQL()}>
                        <TimelineOppositeContent color='secondary' fontSize='small'>
                            {deadline.date
                                .setLocale(settings.language)
                                ?.toLocaleString(DateTime.DATE_MED)}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            {deadline.items.map((item) => (
                                <Typography
                                    key={item.label}
                                    variant='body1'
                                    sx={{ color: status(item.status, 700)?.color }}>
                                    {item.label}
                                </Typography>
                            ))}
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    ) : (
        <Typography textAlign='center'>{t('view.work.dashboard.deadline.none')}</Typography>
    )
}

export default DeadlinesBox
