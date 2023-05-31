import { useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DateRangePicker } from '@wojtekmaj/react-daterange-picker'
import { Value } from '@wojtekmaj/react-daterange-picker/dist/cjs/shared/types'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime, Interval } from 'luxon'
import { Line } from 'react-chartjs-2'
import { useRouteLoaderData } from 'react-router-dom'
import { YYYYMMDD } from '@sl/constants'
import { StatisticModel, WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import { getHex } from '@sl/theme/utils'
import { ObjectNumber, ObjectObjectNumber } from '@sl/types'

import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'

ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
)

const DEFAULT_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            ticks: {
                display: false
            }
        }
    }
}

const WordsByPeriod = () => {
    const [statisticsDates, setStatisticDates] = useState<DateTime[]>([])
    const settings = useSettings()
    const work = useRouteLoaderData('work') as WorkModel
    const [statistics, setStatistics] = useState<ObjectNumber>({})
    const [startDate, setStartDate] = useState<Date>(
        DateTime.now().setZone('UTC').minus({ days: 7 }).startOf('day').toJSDate()
    )
    const [endDate, setEndDate] = useState<Date>(
        DateTime.now().setZone('UTC').minus({ days: 1 }).endOf('day').toJSDate()
    )

    const fillStats = useCallback(
        (stats: StatisticModel[]) => {
            const sectionIds = [...new Set(stats.map((stat) => stat.section.id))]
            const fill: ObjectObjectNumber = {}

            statisticsDates.forEach((date) => {
                const ymd = date.toFormat(YYYYMMDD)
                fill[ymd] = {}

                sectionIds.forEach((sectionId) => {
                    fill[ymd][sectionId] =
                        stats.find(
                            (stat) =>
                                stat.section.id === sectionId &&
                                DateTime.fromJSDate(stat.createdAt).toFormat(YYYYMMDD) === ymd
                        )?.words || 0

                    if (!fill[ymd][sectionId]) {
                        try {
                            fill[ymd][sectionId] =
                                fill[date.minus({ days: 1 }).toFormat(YYYYMMDD)][sectionId]
                        } catch {
                            fill[ymd][sectionId] = 0
                        }
                    }
                })
            })

            return fill
        },
        [statisticsDates]
    )

    useEffect(() => {
        setStatisticDates(
            Interval.fromDateTimes(
                DateTime.fromJSDate(startDate).startOf('day'),
                DateTime.fromJSDate(endDate).endOf('day')
            )
                .splitBy({ day: 1 })
                .map((d) => d.start)
        )
    }, [startDate, endDate])

    useEffect(() => {
        work.statistics
            .extend(
                Q.where(
                    'created_at',
                    Q.between(
                        DateTime.fromJSDate(startDate).startOf('day').toMillis(),
                        DateTime.fromJSDate(endDate).endOf('day').toMillis()
                    )
                ),
                Q.sortBy('created_at', Q.asc)
            )
            .fetch()
            .then((stats) =>
                setStatistics(
                    Object.entries(fillStats(stats)).reduce((o, [date, stats]) => {
                        const ymd = date
                        if (!o[ymd]) {
                            o[ymd] = 0
                        }
                        o[ymd] += Object.values(stats).reduce((count, stat) => count + stat, 0)
                        return o
                    }, {} as ObjectNumber)
                )
            )
    }, [statisticsDates])

    return (
        <Box className='relative h-full p-3 w-auto grid place-items-center'>
            <Box className='absolute z-10 top-2 right-2 bg-white'>
                <DateRangePicker
                    value={[startDate, endDate]}
                    onChange={(value: Value) => {
                        if (Array.isArray(value)) {
                            setStartDate(value[0])
                            setEndDate(value[1])
                        } else {
                            setStartDate(value)
                            setEndDate(value)
                        }
                    }}
                    clearIcon={null}
                    calendarIcon={null}
                />
            </Box>
            <Line
                options={{
                    ...DEFAULT_OPTIONS
                }}
                data={{
                    labels: statisticsDates.map((d) =>
                        d.setLocale(settings.language).toFormat('LLL dd yyyy')
                    ),
                    datasets: [
                        {
                            label: '',
                            data: statisticsDates.map((d) => statistics[d.toFormat(YYYYMMDD)] || 0),
                            borderColor: getHex('emerald', 600),
                            backgroundColor: getHex('emerald', 100)
                        }
                    ]
                }}
            />
        </Box>
    )
}

export default WordsByPeriod
