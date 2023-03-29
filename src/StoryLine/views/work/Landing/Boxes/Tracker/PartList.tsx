import { useTranslation } from 'react-i18next'
import { ListItem, ListItemText, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'

import ChapterList from './ChapterList'
import { PartListProps } from './types'

const PartList = ({ parts, chapters, scenes }: PartListProps) => {
    const { t } = useTranslation()

    return (
        <>
            {parts.map((part) => (
                <>
                    <ListItem
                        key={part.id}
                        sx={{
                            backgroundColor: status(part.status, 200).color,
                            marginBottom: '1px'
                        }}
                        secondaryAction={<Progress words={part.wordCount} goal={part.wordGoal} />}>
                        <ListItemText
                            primary={
                                <Typography
                                    variant='body1'
                                    className='whitespace-nowrap overflow-hidden text-ellipsis
                                    pr-3'>
                                    {part.displayTitle}
                                </Typography>
                            }
                            secondary={
                                part.daysRemaining ? (
                                    <Typography variant='body2'>
                                        {t('view.work.landing.tracker.remaining', {
                                            days: part.daysRemaining,
                                            words: part.wordsPerDay
                                        })}
                                    </Typography>
                                ) : null
                            }
                        />
                    </ListItem>
                    <ChapterList
                        chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                        scenes={scenes}
                    />
                </>
            ))}
        </>
    )
}

export default PartList
