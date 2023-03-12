import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import useTabs from '@sl/layouts/Work/useTabs'

import { SceneListProps } from '../types'

const SceneList = ({ scenes }: SceneListProps) => {
    const tabs = useTabs()

    return (
        <List dense disablePadding className='bg-white'>
            {scenes.map((scene) => (
                <ListItem key={scene.id} disablePadding disableGutters divider>
                    <ListItemButton
                        onClick={() =>
                            tabs.loadTab({
                                id: scene.id,
                                label: scene.displayTitle,
                                link: `section/${scene.id}`
                            })
                        }>
                        <ListItemText
                            primary={
                                <Typography
                                    variant='body1'
                                    className='whitespace-nowrap text-ellipsis overflow-hidden'>
                                    {scene.displayTitle}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default SceneList
