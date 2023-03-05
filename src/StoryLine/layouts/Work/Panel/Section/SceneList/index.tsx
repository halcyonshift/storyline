import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import { SceneListProps } from '../types'

const SceneList = ({ scenes, loadTab }: SceneListProps) => (
    <List dense className='bg-white'>
        {scenes.map((scene) => (
            <ListItem key={scene.id}>
                <ListItemText
                    className='overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer'
                    onClick={() =>
                        loadTab({
                            id: scene.id,
                            label: scene.displayTitle,
                            link: `section/${scene.id}`
                        })
                    }>
                    {scene.displayTitle}
                </ListItemText>
            </ListItem>
        ))}
    </List>
)

export default SceneList
