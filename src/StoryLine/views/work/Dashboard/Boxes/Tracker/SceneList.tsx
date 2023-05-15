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
                        className='grid grid-cols-1 xl:grid-cols-2 gap-1 p-2'
                        sx={{
                            backgroundColor: status(scene.status).color,
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
                        <Progress words={1000} goal={2000} />
                    </Box>
                </Fragment>
            ))}
        </>
    )
}

export default SceneList
