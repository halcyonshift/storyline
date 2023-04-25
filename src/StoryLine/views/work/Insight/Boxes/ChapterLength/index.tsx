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
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import stringToColor from 'string-to-color'
import { WorkModel } from '@sl/db/models'
import { getHex } from '@sl/theme/utils'
import { toWords } from '@sl/utils'

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
    plugins: {
        legend: {
            display: false
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        }
    }
}

const ChapterLengthBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [statistics, setStatistics] = useState<any[]>([])
    const [labels, setLabels] = useState<string[]>()
    const { t } = useTranslation()

    useEffect(() => {
        Promise.all([work.statistics.fetch(), work.chapters.fetch(), work.scenes.fetch()]).then(
            ([stats, chapters, scenes]) => {
                setLabels(chapters.map((chapter) => `#${chapter.order}`))
                const maxScenesLength = chapters.reduce((max, chapter) => {
                    const scenesLength = scenes.filter(
                        (scene) => scene.section.id === chapter.id
                    ).length
                    if (scenesLength > max) max = scenesLength
                    return max
                }, 0)
                const datasets = []

                for (let i = 0; i < maxScenesLength; i++) {
                    const dataset = {
                        label: t('view.work.insight.chapterLength.scene', { number: i + 1 }),
                        data: chapters.map((chapter) => {
                            const chapterScenes = scenes.filter(
                                (scene) => scene.section.id === chapter.id
                            )
                            if (chapterScenes[i]) {
                                return stats.reduce((sum, stat) => {
                                    if (stat.section.id == chapterScenes[i].id) sum += stat.words
                                    return sum
                                }, 0)
                            } else {
                                return 0
                            }
                        }),
                        borderColor: getHex('white'),
                        backgroundColor: stringToColor(`scene${toWords(i + 1)}`),
                        borderWidth: 2
                    }
                    datasets.push(dataset)
                }
                setStatistics(datasets)
            }
        )
    }, [])

    return (
        <Box className='relative h-full p-3 w-auto grid place-items-center'>
            <Bar
                options={{
                    ...DEFAULT_OPTIONS
                }}
                data={{
                    labels,
                    datasets: statistics
                }}
            />
        </Box>
    )
}

export default ChapterLengthBox
