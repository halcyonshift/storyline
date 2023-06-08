import List from '@mui/material/List'
import { useObservable } from 'rxjs-hooks'
import ListItem from '@sl/components/ListItem'
import { SectionViewType } from '../types'

const ChapterView = ({ section }: SectionViewType) => {
    const scenes = useObservable(() => section.scenes.observeWithColumns(['title']), [], [])

    return (
        <List disablePadding className='w-full'>
            {scenes.map((scene) => (
                <ListItem
                    divider
                    key={scene.id}
                    tab={{
                        id: scene.id,
                        mode: 'section'
                    }}
                    primary={scene.displayName}
                    secondary={scene.description}
                />
            ))}
        </List>
    )
}

export default ChapterView
