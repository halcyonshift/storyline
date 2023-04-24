/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { PointOfView } from '@sl/constants/pov'
import { WorkModel } from '@sl/db/models'
import stringToColor from 'string-to-color'
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

const position: any = 'right'

const DEFAULT_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position
        }
    }
}

const PointOfViewBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const [povStatistics, setPovStatistics] = useState<any[]>([])
    const [povModeStatistics, setPovModeStatistics] = useState<any[]>([])
    const [povLabels, setPovLabels] = useState<string[]>()
    const [povModeLabels, setPovModeLabels] = useState<string[]>()
    const { t } = useTranslation()

    useEffect(() => {
        const _povStatistics: any = {}
        const _povModeStatistics: any = {}

        Promise.all([work.scenes.fetch(), work.characters.fetch()]).then(([scenes, characters]) => {
            scenes
                .filter((scene) => scene.pointOfViewCharacter)
                .map((scene) => {
                    if (!_povStatistics[scene.pointOfViewCharacter.id]) {
                        _povStatistics[scene.pointOfViewCharacter.id] = {
                            character: characters.find(
                                (character) => character.id === scene.pointOfViewCharacter.id
                            ),
                            scenes: 0
                        }
                    }
                    _povStatistics[scene.pointOfViewCharacter.id].scenes += 1

                    if (!_povModeStatistics[scene.pointOfView]) {
                        _povModeStatistics[scene.pointOfView] = 0
                    }
                    _povModeStatistics[scene.pointOfView] += 1
                })
            setPovModeLabels(
                Object.values(PointOfView).map((pov) => t(`constant.pointOfView.${pov}`))
            )
            setPovLabels(
                Object.values(_povStatistics).map(
                    (pov: any) => pov.character?.displayName || 'None'
                )
            )

            setPovStatistics(Object.values(_povStatistics))
            setPovModeStatistics(Object.values(_povModeStatistics))
        })
    }, [])

    return (
        <Box className='grid grid-cols-2 gap-3 h-full'>
            <Box className='relative h-full p-3 w-auto grid place-items-center'>
                <Doughnut
                    options={DEFAULT_OPTIONS}
                    data={{
                        labels: povLabels,
                        datasets: [
                            {
                                label: 'Uses',
                                data: povStatistics.map((stat) => stat.scenes),
                                borderWidth: 2,
                                backgroundColor: povLabels
                                    ? povLabels.map((label) =>
                                          label === 'None'
                                              ? getHex('slate', 200)
                                              : stringToColor(label)
                                      )
                                    : []
                            }
                        ]
                    }}
                />
            </Box>
            <Box className='relative h-full p-3 w-auto grid place-items-center'>
                <Doughnut
                    options={DEFAULT_OPTIONS}
                    data={{
                        labels: povModeLabels,
                        datasets: [
                            {
                                label: 'Uses',
                                data: povModeStatistics,
                                borderWidth: 2,
                                backgroundColor: povModeLabels
                                    ? povModeLabels.map((label, index) =>
                                          label === 'None'
                                              ? getHex('slate', 200)
                                              : [
                                                    getHex('red', 400),
                                                    getHex('yellow', 400),
                                                    getHex('green', 400),
                                                    getHex('blue', 400),
                                                    getHex('purple', 400)
                                                ][index]
                                      )
                                    : []
                            }
                        ]
                    }}
                />
            </Box>
        </Box>
    )
}

export default PointOfViewBox
