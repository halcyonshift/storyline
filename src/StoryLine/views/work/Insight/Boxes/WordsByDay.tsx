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

    useEffect(() => {
        work.statistics.fetch().then((stats) => {
            const _labels = [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
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
        <Box className='relative'>
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
                            borderColor: getHex('emerald', 600),
                            backgroundColor: getHex('emerald', 100),
                            borderWidth: 2
                        }
                    ]
                }}
            />
        </Box>
    )
}

export default WordsByDayBox
