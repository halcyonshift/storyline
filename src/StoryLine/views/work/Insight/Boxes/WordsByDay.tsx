import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime } from 'luxon'
import { Bar } from 'react-chartjs-2'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import { getHex } from '@sl/theme/utils'
import { useTranslation } from 'react-i18next'

ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
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
    }
}

const WordsByDayBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [statistics, setStatistics] = useState<any[]>([])
    const [labels, setLabels] = useState<string[]>()
    const { t } = useTranslation()

    useEffect(() => {
        work.statistics.fetch().then((stats) => {
            const _labels = [
                t('view.work.insight.wordsByDay.mon'),
                t('view.work.insight.wordsByDay.tue'),
                t('view.work.insight.wordsByDay.wed'),
                t('view.work.insight.wordsByDay.thu'),
                t('view.work.insight.wordsByDay.fri'),
                t('view.work.insight.wordsByDay.sat'),
                t('view.work.insight.wordsByDay.sun')
            ]
            setLabels(_labels)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const datasets: any = {}
            _labels.map((label, labelIndex) => {
                stats.map((stat) => {
                    if (!datasets[label]) datasets[label] = 0
                    const dayOfWeek = DateTime.fromJSDate(stat.createdAt).weekday - 1
                    if (dayOfWeek == labelIndex) datasets[label] += stat.words
                })
            })

            setStatistics(Object.values(datasets))
        })
    }, [])

    return (
        <Box className='relative h-full p-3 w-auto grid place-items-center'>
            <Bar
                options={{
                    ...DEFAULT_OPTIONS
                }}
                data={{
                    labels,
                    datasets: [
                        {
                            label: 'Words written',
                            data: statistics,
                            borderColor: getHex('white'),
                            backgroundColor: [
                                getHex('red', 400),
                                getHex('orange', 400),
                                getHex('yellow', 400),
                                getHex('green', 400),
                                getHex('blue', 400),
                                getHex('indigo', 400),
                                getHex('violet', 400)
                            ],
                            borderWidth: 2
                        }
                    ]
                }}
            />
        </Box>
    )
}

export default WordsByDayBox
