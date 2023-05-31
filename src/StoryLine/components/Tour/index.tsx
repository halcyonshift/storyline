import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Joyride, { Step, CallBackProps, ACTIONS, STATUS, EVENTS } from 'react-joyride'
import { useNavigate } from 'react-router-dom'

const Tour = ({ prefix, steps }: { prefix: 'storyline' | 'work'; steps: Partial<Step>[] }) => {
    const [links, setLinks] = useState<{ [key: string]: string }>({})
    const [stepIndex, setStepIndex] = useState<number>(0)
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        setLinks(
            prefix === 'storyline'
                ? {
                      index_2: '/info',
                      index_4: '/settings',
                      index_7: '/backupRestore',
                      index_9: '/import'
                  }
                : {}
        )
    }, [])

    const handleStorylineCallback = (link: string, nextIndex: number) => {
        if (link || [3, 6, 8, 10].includes(nextIndex)) {
            navigate(link || '/')
            setStepIndex(nextIndex)
        } else {
            setStepIndex(nextIndex)
        }
    }

    const handleWorkCallback = (link: string, nextIndex: number) => {
        if (link || [3, 6, 8, 10].includes(nextIndex)) {
            navigate(link || '/')
            setStepIndex(nextIndex)
        } else {
            setStepIndex(nextIndex)
        }
    }

    const handleCallback = (data: CallBackProps) => {
        const { action, index, type, status } = data

        if (action === ACTIONS.CLOSE || status === STATUS.SKIPPED || status === STATUS.FINISHED) {
            // set no show
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

    return (
        <Joyride
            callback={handleCallback}
            stepIndex={stepIndex}
            continuous
            hideCloseButton
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={
                steps.map((step, index) => ({
                    ...step,
                    ['content']: (
                        <Typography variant='body1'>{t(`tour.${prefix}.step${index}`)}</Typography>
                    )
                })) as Step[]
            }
        />
    )
}

export default Tour
