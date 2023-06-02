import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Joyride, { Step, CallBackProps, ACTIONS, STATUS, EVENTS } from 'react-joyride'
import { useLocation, useNavigate } from 'react-router-dom'
import { htmlParse } from '@sl/utils/html'
import { TourContextType } from './types'

const TourContext = createContext({} as TourContextType)

export const TourProvider = ({ children }: { children: ReactNode }) => {
    const [links, setLinks] = useState<{ [key: string]: string }>({})
    const [prefix, setPrefix] = useState<'storyline' | 'work'>('storyline')
    const [run, setRun] = useState<boolean>(false)
    const [stepIndex, setStepIndex] = useState<number>(0)
    const [steps, setSteps] = useState<Partial<Step>[]>([])
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const start = (prefix: 'storyline' | 'work') => {
        setPrefix(prefix)
        setRun(true)
    }

    const end = () => {
        setRun(false)
        setStepIndex(0)
    }

    const handleStorylineCallback = (link: string, nextIndex: number) => {
        if (link || [3, 6, 8, 10].includes(nextIndex)) {
            navigate(link || '/')
            setStepIndex(nextIndex)
        } else {
            setStepIndex(nextIndex)
        }
    }

    const handleWorkCallback = (link: string, nextIndex: number) => {
        setStepIndex(nextIndex)
    }

    const handleCallback = async (data: CallBackProps) => {
        const { action, index, type, status } = data

        if (action === ACTIONS.CLOSE || status === STATUS.SKIPPED || status === STATUS.FINISHED) {
            end()
        } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1)
            const link = links[`index_${nextIndex}` as keyof typeof links]

            if (prefix === 'storyline') {
                handleStorylineCallback(link, nextIndex)
            } else {
                handleWorkCallback(link, nextIndex)
            }
        }

        return data
    }

    // eslint-disable-next-line complexity
    useEffect(() => {
        if (prefix === 'storyline') {
            setSteps([
                { placement: 'center', target: 'body' },
                { target: '#info' },
                { placement: 'center', target: 'body' },
                { target: '#settings' },
                { target: '.MuiTabs-flexContainer .MuiButtonBase-root:first-of-type' },
                { target: '.MuiTabs-flexContainer .MuiButtonBase-root:last-of-type' },
                { target: '#backupRestore' },
                { placement: 'center', target: 'body' },
                { target: '#import' },
                { placement: 'center', target: 'body' },
                { target: '#new' }
            ])
            setLinks({
                index_2: '/info',
                index_4: '/settings',
                index_7: '/backupRestore',
                index_9: '/import'
            })
            return
        }

        let _steps: Partial<Step>[] = []

        if (document.getElementById('dashboardWordChart') && !document.getElementById('panel')) {
            _steps = [
                { placement: 'center', target: 'body', content: 'tour.work.welcome' },
                { target: '#navigationSection', content: 'tour.work.navigation.section' },
                { target: '#navigationCharacter', content: 'tour.work.navigation.character' },
                { target: '#navigationLocation', content: 'tour.work.navigation.location' },
                { target: '#navigationItem', content: 'tour.work.navigation.item' },
                { target: '#navigationNote', content: 'tour.work.navigation.note' },
                { target: '#navigationSearch', content: 'tour.work.navigation.search' },
                { target: '#navigationOverview', content: 'tour.work.navigation.overview' },
                { target: '#navigationConnection', content: 'tour.work.navigation.connection' },
                { target: '#navigationInsight', content: 'tour.work.navigation.insight' },
                { target: '#navigationExport', content: 'tour.work.navigation.export' },
                {
                    target: '#navigationSettings',
                    content: 'tour.work.navigation.settings'
                }
            ]
        }

        if (document.getElementById('panel-action-addPart')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.panel.section.intro' },
                { target: '#panel-action-addPart', content: 'tour.work.panel.section.addPart' },
                {
                    target: '#panel-action-addChapter',
                    content: 'tour.work.panel.section.addChapter'
                },
                { target: '#panel-action-addScene', content: 'tour.work.panel.section.addScene' },
                {
                    target: '#panel-action-startSprint',
                    content: 'tour.work.panel.section.startSprint'
                },
                {
                    target: '#panel ul > li div[role=button]:first-of-type',
                    content: 'tour.work.panel.section.view'
                },
                {
                    target: '#panel ul > li button:first-of-type',
                    content: 'tour.work.panel.section.addNote'
                }
            ])
        } else if (document.getElementById('panel-action-addPrimary')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.panel.character.intro' },
                {
                    target: '#panel-action-addPrimary',
                    content: 'tour.work.panel.character.addPrimary'
                },
                {
                    target: '#panel-action-addSecondary',
                    content: 'tour.work.panel.character.addSecondary'
                },
                {
                    target: '#panel-action-addTertiary',
                    content: 'tour.work.panel.character.addTertiary'
                }
            ])
        } else if (document.getElementById('panel-action-addLocation')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.panel.location.intro' },
                { target: '#panel-action-addLocation', content: 'tour.work.panel.location.add' },
                {
                    target: '#panel ul > li div[role=button]:first-of-type',
                    content: 'tour.work.panel.location.view'
                },
                {
                    target: '#panel ul > li button:first-of-type',
                    content: 'tour.work.panel.location.addLocation'
                },
                {
                    target: '#panel ul > li button:nth-of-type(2)',
                    content: 'tour.work.panel.location.addNote'
                }
            ])
        } else if (document.getElementById('panel-action-addItem')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.panel.item.intro' },
                { target: '#panel-action-addItem', content: 'tour.work.panel.item.add' },
                {
                    target: '#panel ul > li div[role=button]:first-of-type',
                    content: 'tour.work.panel.item.view'
                },
                {
                    target: '#panel ul > li button:first-of-type',
                    content: 'tour.work.panel.item.addNote'
                }
            ])
        } else if (document.getElementById('panel-action-addNote')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.panel.note.intro' },
                { target: '#panel-action-addNote', content: 'tour.work.panel.note.add' },
                {
                    target: '#panel ul > li div[role=button]:first-of-type',
                    content: 'tour.work.panel.note.view'
                },
                {
                    target: '#panel ul > li button:first-of-type',
                    content: 'tour.work.panel.note.addNote'
                }
            ])
        } else if (document.getElementById('search')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.panel.search.intro' },
                { target: '#search', content: 'tour.work.panel.search.input' }
            ])
        }

        if (document.getElementById('status-widget')) {
            _steps = _steps.concat([
                { target: '#status-widget', content: 'tour.work.statusWidget', disableBeacon: true }
            ])
        }

        if (document.getElementById('dashboardWordChart')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.dashboard.intro' },
                { target: '#dashboardWordChart', content: 'tour.work.dashboard.chart' },
                { target: '#dashboardTracker', content: 'tour.work.dashboard.tracker' },
                { target: '#dashboardLastUpdate', content: 'tour.work.dashboard.lastUpdate' },
                { target: '#dashboardDeadline', content: 'tour.work.dashboard.deadline' },
                { target: '#dashboardRandom', content: 'tour.work.dashboard.random' }
            ])
        }

        if (document.getElementById('isTaggable')) {
            _steps = _steps.concat([
                { target: '.colorField', content: 'tour.work.note.color', disableBeacon: true },
                { target: '#isTaggable', content: 'tour.work.note.taggable' }
            ])
        }

        if (document.getElementsByClassName('leaflet-container').length) {
            _steps = _steps.concat([
                {
                    target: '.leaflet-container',
                    content: 'tour.work.location.map',
                    disableBeacon: true
                }
            ])
        }

        if (document.getElementById('rte-sceneBody')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.scene.intro' },
                { target: '#rteToolbarExcerpt', content: 'tour.work.scene.toolbar.excerpt' },
                { target: '#menu-tag', content: 'tour.work.scene.toolbar.tag' },
                { target: '#menu-version', content: 'tour.work.scene.toolbar.version' }
            ])
        }

        if (document.getElementById('overviewView')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.overview.intro' }
            ])
        }

        if (document.getElementById('connectionView')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.connection.intro' },
                { target: '#connectionNew', content: 'tour.work.connection.new' },
                { target: '.MuiSwitch-root', content: 'tour.work.connection.switch' }
            ])
        }

        if (document.getElementById('exportView')) {
            _steps = _steps.concat([
                { placement: 'center', target: 'body', content: 'tour.work.export.intro' }
            ])
        }

        setSteps(_steps)
        if (!_steps.length) setRun(false)
    }, [prefix, run, location.pathname])

    return (
        <TourContext.Provider
            value={useMemo(
                () => ({
                    start
                }),
                [stepIndex]
            )}>
            {children}
            <Joyride
                callback={handleCallback}
                stepIndex={stepIndex}
                run={run}
                continuous
                hideCloseButton
                scrollToFirstStep
                disableScrolling
                showProgress
                showSkipButton
                steps={
                    steps.map((step, index) => ({
                        ...step,
                        ['content']: (
                            <Typography variant='body1'>
                                {htmlParse(
                                    t(
                                        step?.content
                                            ? step.content.toString()
                                            : `tour.${prefix}.step${index}`
                                    )
                                )}
                            </Typography>
                        )
                    })) as Step[]
                }
            />
        </TourContext.Provider>
    )
}

const useTour = () => useContext(TourContext)

export default useTour
