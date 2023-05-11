import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'

import ChapterList from './ChapterList'
import { PartListProps } from './types'

const PartList = ({ parts, chapters, scenes }: PartListProps) => {
    const { t } = useTranslation()

    return (
        <>
            {parts.map((part) => (
                <Fragment key={part.id}>
                    <Box
                        className='grid grid-cols-1 xl:grid-cols-3 gap-1 xl:pr-2'
                        sx={{
                            backgroundColor: status(part.status, 200).color,
                            marginBottom: '1px'
                        }}>
                        <Box className='col-span-2 px-2 py-1'>
                            <Typography
                                variant='body1'
                                className='whitespace-nowrap overflow-hidden text-ellipsis
                pr-3'>
                                {part.displayTitle}
                            </Typography>
                            {part.daysRemaining ? (
                                <Typography variant='body2'>
                                    {t('view.work.dashboard.tracker.remaining', {
                                        days: part.daysRemaining,
                                        words: part.wordsPerDay
                                    })}
                                </Typography>
                            ) : null}
                        </Box>
                        <Progress words={part.wordCount} goal={part.wordGoal} />
                    </Box>
                    <ChapterList
                        chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                        scenes={scenes}
                    />
                </Fragment>
            ))}
        </>
    )
}

export default PartList
