import { useEffect, useState, SyntheticEvent, useCallback } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import * as Q from '@nozbe/watermelondb/QueryDescription'
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
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { YYYYMMDD } from '@sl/constants'
import { StatisticModel, WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import { getHex } from '@sl/theme/utils'
import { ObjectNumber, ObjectObjectNumber } from '@sl/types'

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

const PADDING = { padding: 0, height: '82%' }

const WordChartsBox = () => {
    const [value, setValue] = useState('1')
    const [statisticsDates] = useState<DateTime[]>(
        Interval.fromDateTimes(
            DateTime.now().minus({ days: 6 }).startOf('day'),
            DateTime.now().endOf('day')
        )
            .splitBy({ day: 1 })
            .map((d) => d.start)
    )
    const settings = useSettings()
    const tabs = useTabs()
    const { t } = useTranslation()
    const work = useRouteLoaderData('work') as WorkModel
    const [statistics, setStatistics] = useState<ObjectNumber>({})
    const [fullStatistics, setFullStatistcs] = useState<StatisticModel[]>([])

    const fillStats = useCallback(
        async (stats: StatisticModel[]) => {
            const sectionIds = [...new Set(stats.map((stat) => stat.section.id))]
            const fill: ObjectObjectNumber = {}

            for await (const date of statisticsDates) {
                const ymd = date.toFormat(YYYYMMDD)
                fill[ymd] = {}

                for await (const sectionId of sectionIds) {
                    let stat = stats.find(
                        (stat) =>
                            stat.section.id === sectionId &&
                            DateTime.fromJSDate(stat.createdAt).toFormat(YYYYMMDD) === ymd
                    )

                    if (!stat) {
                        stat = fullStatistics
                            .filter(
                                (stat) =>
                                    stat.section.id === sectionId &&
                                    stat.createdAt < date.toJSDate()
                            )
                            .at(-1)
                    }

                    fill[ymd][sectionId] = stat?.words || 0

                    if (!fill[ymd][sectionId]) {
                        try {
                            fill[ymd][sectionId] =
                                fill[date.minus({ days: 1 }).toFormat(YYYYMMDD)][sectionId]
                        } catch {
                            fill[ymd][sectionId] = 0
                        }
                    }
                }
            }

            return fill
        },
        [statisticsDates, fullStatistics]
    )

    useEffect(() => {
        tabs.setShowTabs(false)
        work.statistics.fetch().then((statistics) => setFullStatistcs(statistics))
    }, [])

    useEffect(() => {
        if (!fullStatistics) return

        work.statistics
            .extend(
                Q.where(
                    'created_at',
                    Q.between(
                        DateTime.now().setZone('UTC').minus({ days: 7 }).startOf('day').toMillis(),
                        DateTime.now().setZone('UTC').endOf('day').toMillis()
                    )
                ),
                Q.sortBy('created_at', Q.asc)
            )
            .fetch()
            .then((stats) =>
                fillStats(stats).then((stats) =>
                    setStatistics(
                        Object.entries(stats).reduce((o, [date, stats]) => {
                            const ymd = date
                            if (!o[ymd]) {
                                o[ymd] = 0
                            }
                            // eslint-disable-next-line max-nested-callbacks
                            o[ymd] += Object.values(stats).reduce((count, stat) => count + stat, 0)
                            return o
                        }, {} as ObjectNumber)
                    )
                )
            )
    }, [fullStatistics])

    return Object.values(statistics).reduce((a, b) => a + b, 0) ? (
        <Box className='relative h-full'>
            <TabContext value={value}>
                <Box className='border-b'>
                    <TabList
                        variant='fullWidth'
                        onChange={(_: SyntheticEvent, newValue: string) => {
                            setValue(newValue)
                        }}
                        aria-label=''>
                        <Tab
                            sx={{ whiteSpace: 'nowrap' }}
                            label={t('view.work.dashboard.wordCharts.count')}
                            value='1'
                        />
                        <Tab
                            sx={{ whiteSpace: 'nowrap' }}
                            label={t('view.work.dashboard.wordCharts.written')}
                            value='2'
                        />
                    </TabList>
                </Box>
                <TabPanel value='1' sx={PADDING}>
                    <Box className='relative h-full p-3 w-auto grid place-items-center'>
                        <Line
                            options={{
                                ...DEFAULT_OPTIONS,
                                ...{
                                    plugins: work.wordGoal
                                        ? {
                                              annotation: {
                                                  annotations: {
                                                      target: {
                                                          type: 'line',
                                                          scaleID: 'y',
                                                          borderWidth: 5,
                                                          borderColor: settings.getHex(600),
                                                          value: work.wordGoal
                                                      }
                                                  }
                                              },
                                              legend: {
                                                  display: false
                                              }
                                          }
                                        : {
                                              legend: {
                                                  display: false
                                              }
                                          }
                                }
                            }}
                            data={{
                                labels: statisticsDates.map((d) =>
                                    d.setLocale(settings.language).toFormat('LLL dd yyyy')
                                ),
                                datasets: [
                                    {
                                        label: '',
                                        data: statisticsDates.map(
                                            (d) => statistics[d.toFormat(YYYYMMDD)] || 0
                                        ),
                                        borderColor: getHex('emerald', 600),
                                        backgroundColor: getHex('emerald', 100)
                                    }
                                ]
                            }}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value='2' sx={PADDING}>
                    <Box className='relative h-full p-3 w-auto grid place-items-center'>
                        <Line
                            options={DEFAULT_OPTIONS}
                            data={{
                                labels: statisticsDates.map((d) =>
                                    d.setLocale(settings.language).toFormat('LLL dd yyyy')
                                ),
                                datasets: [
                                    {
                                        label: '',
                                        data: statisticsDates.map((d) => {
                                            return (
                                                (statistics[d.toFormat(YYYYMMDD)] || 0) -
                                                (statistics[
                                                    d.minus({ days: 1 }).toFormat(YYYYMMDD)
                                                ] || 0)
                                            )
                                        }),
                                        borderColor: getHex('emerald', 600),
                                        backgroundColor: getHex('emerald', 100)
                                    }
                                ]
                            }}
                        />
                    </Box>
                </TabPanel>
            </TabContext>
        </Box>
    ) : (
        <Box className='grid h-full place-items-center p-3'>
            {t('view.work.dashboard.wordCharts.noData')}
        </Box>
    )
}

export default WordChartsBox
