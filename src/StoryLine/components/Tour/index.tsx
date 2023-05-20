import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Joyride, { Step, CallBackProps, ACTIONS, LIFECYCLE, EVENTS } from 'react-joyride'
import { useNavigate } from 'react-router-dom'

const Tour = ({ prefix, steps }: { prefix: 'storyline' | 'work'; steps: Partial<Step>[] }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleCallback = (data: CallBackProps) => {
        const { action, index, lifecycle, type } = data

        if (
            action == ACTIONS.NEXT &&
            index === 2 &&
            lifecycle === LIFECYCLE.COMPLETE &&
            type === EVENTS.STEP_AFTER
        ) {
            navigate('/settings')
        }

        return data
    }

    return (
        <Joyride
            callback={handleCallback}
            continuous
            hideCloseButton
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={
                steps.map((step, index) => ({
                    ...step,
                    ['content']: (
                        <Typography variant='body1'>
                            {t(`tour.${prefix}.step${index + 1}`)}
                        </Typography>
                    )
                })) as Step[]
            }
        />
    )
}

export default Tour
