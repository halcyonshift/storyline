import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'
import { SceneListProps } from './types'

const SceneList = ({ scenes }: SceneListProps) => {
    const { t } = useTranslation()

    return (
        <>
            {scenes.map((scene) => (
                <Fragment key={scene.id}>
                    <Box
                        className='grid grid-cols-1 xl:grid-cols-3 gap-1 xl:pr-2'
                        sx={{
                            backgroundColor: status(scene.status).color,
                            marginBottom: '1px'
                        }}>
                        <Box className='col-span-2 px-2 py-1'>
                            <Typography
                                variant='body1'
                                className='whitespace-nowrap overflow-hidden text-ellipsis
                                    pr-3'>
                                {scene.displayTitle}
                            </Typography>
                            {scene.daysRemaining ? (
                                <Typography variant='body2'>
                                    {t('view.work.landing.tracker.remaining', {
                                        days: scene.daysRemaining,
                                        words: scene.wordsPerDay
                                    })}
                                </Typography>
                            ) : null}
                        </Box>
                        <Progress words={scene.wordCount} goal={scene.wordGoal} />
                    </Box>
                </Fragment>
            ))}
        </>
    )
}

export default SceneList
