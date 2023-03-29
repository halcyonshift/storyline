import { useTranslation } from 'react-i18next'
import { ListItem, ListItemText, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'
import SceneList from './SceneList'
import { ChapterListProps } from './types'

const ChapterList = ({ chapters, scenes }: ChapterListProps) => {
    const { t } = useTranslation()

    return (
        <>
            {chapters.map((chapter) => (
                <>
                    <ListItem
                        key={chapter.id}
                        sx={{
                            backgroundColor: status(chapter.status, 100).color,
                            marginBottom: '1px'
                        }}
                        secondaryAction={
                            <Progress words={chapter.wordCount} goal={chapter.wordGoal} />
                        }>
                        <ListItemText
                            primary={
                                <Typography
                                    variant='body1'
                                    className='whitespace-nowrap overflow-hidden text-ellipsis
                                    pr-3'>
                                    {chapter.displayTitle}
                                </Typography>
                            }
                            secondary={
                                chapter.daysRemaining ? (
                                    <Typography variant='body2'>
                                        {t('view.work.landing.tracker.remaining', {
                                            days: chapter.daysRemaining,
                                            words: chapter.wordsPerDay
                                        })}
                                    </Typography>
                                ) : null
                            }
                        />
                    </ListItem>
                    <SceneList scenes={scenes.filter((scene) => scene.section.id === chapter.id)} />
                </>
            ))}
        </>
    )
}

export default ChapterList
