import List from '@mui/material/List'
import { useObservable } from 'rxjs-hooks'
import ListItem from '@sl/components/ListItem'
import { htmlToText } from '@sl/utils/html'
import { SectionViewType } from '../types'

const PartView = ({ section }: SectionViewType) => {
    const chapters = useObservable(() => section.chapters.observeWithColumns(['title']), [], [])

    return (
        <List disablePadding className='w-full'>
            {chapters.map((chapter) => (
                <ListItem
                    divider
                    key={chapter.id}
                    tab={{
                        id: chapter.id,
                        mode: 'section'
                    }}
                    primary={chapter.displayName}
                    secondary={htmlToText(chapter.description)}
                />
            ))}
        </List>
    )
}

export default PartView
