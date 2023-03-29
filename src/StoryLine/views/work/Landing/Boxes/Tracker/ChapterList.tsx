import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'
import SceneList from './SceneList'
import { ChapterListProps } from './types'

const ChapterList = ({ chapters, scenes }: ChapterListProps) => {
    const { t } = useTranslation()

    return (
        <>
            {chapters.map((chapter) => (
                <Fragment key={chapter.id}>
                    <Box
                        className='grid grid-cols-1 xl:grid-cols-3 gap-1 px-2 py-1'
                        sx={{
                            backgroundColor: status(chapter.status, 100).color,
                            marginBottom: '1px'
                        }}>
                        <Box className='col-span-2'>
                            <Typography
                                variant='body1'
                                className='whitespace-nowrap overflow-hidden text-ellipsis
                                    pr-3'>
                                {chapter.displayTitle}
                            </Typography>
                            {chapter.daysRemaining ? (
                                <Typography variant='body2'>
                                    {t('view.work.landing.tracker.remaining', {
                                        days: chapter.daysRemaining,
                                        words: chapter.wordsPerDay
                                    })}
                                </Typography>
                            ) : null}
                        </Box>
                        <Progress words={chapter.wordCount} goal={chapter.wordGoal} />
                    </Box>
                    <SceneList scenes={scenes.filter((scene) => scene.section.id === chapter.id)} />
                </Fragment>
            ))}
        </>
    )
}

export default ChapterList
