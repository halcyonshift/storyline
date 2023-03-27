import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from '@sl/components/Image'
import { TabPanelProps } from './types'

const ImagesPanel = ({ notes }: TabPanelProps) => {
    return (
        <ImageList cols={3} className='m-1'>
            {notes.map((note) => (
                <ImageListItem key={`image-${note.id}`}>
                    <Image path={note.image} alt={note.title} loading='lazy' />
                </ImageListItem>
            ))}
        </ImageList>
    )
}

export default ImagesPanel
