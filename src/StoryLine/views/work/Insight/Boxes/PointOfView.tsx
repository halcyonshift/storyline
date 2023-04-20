/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime } from 'luxon'
import { Doughnut } from 'react-chartjs-2'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import { getHex } from '@sl/theme/utils'

ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
)

ChartJS.defaults.plugins.legend.display = false

const DEFAULT_OPTIONS = {
    responsive: true
}

const PointOfViewBox = () => {
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
        <Box className='grid grid-cols-2 gap-3'>
            <Box className='relative'>
                <Doughnut
                    options={{
                        ...DEFAULT_OPTIONS
                    }}
                    data={{
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [
                            {
                                label: '# of Votes',
                                data: [12, 19, 3, 5, 2, 3],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }
                        ]
                    }}
                />
            </Box>
            <Box className='relative'>
                <Doughnut
                    options={{
                        ...DEFAULT_OPTIONS
                    }}
                    data={{
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [
                            {
                                label: '# of Votes',
                                data: [12, 19, 3, 5, 2, 3],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }
                        ]
                    }}
                />
            </Box>
        </Box>
    )
}

export default PointOfViewBox
