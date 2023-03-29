import { useTranslation } from 'react-i18next'
import { ListItem, ListItemText, Typography } from '@mui/material'
import Progress from '@sl/components/Progress'
import { status } from '@sl/theme/utils'
import { SceneListProps } from './types'

const SceneList = ({ scenes }: SceneListProps) => {
    const { t } = useTranslation()

    return (
        <>
            {scenes.map((scene) => (
                <>
                    <ListItem
                        key={scene.id}
                        sx={{ backgroundColor: status(scene.status).color, marginBottom: '1px' }}
                        secondaryAction={
                            <Progress words={scene.wordCount} goal={scene.wordGoal} />
                        }>
                        <ListItemText
                            primary={
                                <Typography
                                    variant='body1'
                                    className='whitespace-nowrap overflow-hidden text-ellipsis
                                    pr-3'>
                                    {scene.displayTitle}
                                </Typography>
                            }
                            secondary={
                                scene.daysRemaining ? (
                                    <Typography variant='body2'>
                                        {t('view.work.landing.tracker.remaining', {
                                            days: scene.daysRemaining,
                                            words: scene.wordsPerDay
                                        })}
                                    </Typography>
                                ) : null
                            }
                        />
                    </ListItem>
                </>
            ))}
        </>
    )
}

export default SceneList
