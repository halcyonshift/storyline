import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'
import { SceneListProps } from './types'
import useSettings from '@sl/theme/useSettings'

const SceneList = ({ scenes }: SceneListProps) => {
    const { t } = useTranslation()
    const { displayMode } = useSettings()

    return (
        <>
            {scenes.map((scene) => (
                <Box
                    key={scene.id}
                    className='grid grid-cols-1 xl:grid-cols-2 gap-1 p-2'
                    sx={{
                        backgroundColor: status(scene.status, displayMode === 'dark' ? 600 : 50)
                            .color,
                        marginBottom: '1px'
                    }}>
                    <Typography
                        variant='body2'
                        className='whitespace-nowrap overflow-hidden text-ellipsis pr-3'>
                        {scene.displayTitle}
                    </Typography>
                    {scene.daysRemaining ? (
                        <Typography variant='body2'>
                            {t('view.work.dashboard.tracker.remaining', {
                                days: scene.daysRemaining,
                                words: scene.wordsPerDay
                            })}
                        </Typography>
                    ) : (
                        <Typography variant='body2' className='text-right'>
                            {scene.words?.toLocaleString()}
                        </Typography>
                    )}
                    <Progress words={scene.words} goal={scene.wordGoal} />
                </Box>
            ))}
        </>
    )
}

export default SceneList