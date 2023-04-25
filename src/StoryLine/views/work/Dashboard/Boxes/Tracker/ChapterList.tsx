import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'
import SceneList from './SceneList'
import { ChapterListProps } from './types'
import useSettings from '@sl/theme/useSettings'

const ChapterList = ({ chapters, scenes }: ChapterListProps) => {
    const { t } = useTranslation()
    const settings = useSettings()

    return (
        <>
            {chapters.map((chapter) => (
                <Fragment key={chapter.id}>
                    <Box
                        className='grid grid-cols-1 xl:grid-cols-3 gap-1 xl:pr-2'
                        sx={{
                            backgroundColor: status(chapter.status, 100).color,
                            marginBottom: '1px'
                        }}>
                        <Box
                            className={`${
                                chapter.wordGoal ? 'col-span-2' : 'col-span-3'
                            } px-2 py-1`}>
                            <Typography
                                variant='body1'
                                className='whitespace-nowrap overflow-hidden text-ellipsis
                                    flex justify-between'>
                                {chapter.displayTitle}
                                {chapter.wordCount && !chapter.wordGoal ? (
                                    <span>
                                        {chapter.wordCount.toLocaleString(settings.language)}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </Typography>
                            {chapter.daysRemaining ? (
                                <Typography variant='body2'>
                                    {t('view.work.dashboard.tracker.remaining', {
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
