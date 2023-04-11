import { Box } from '@mui/material'
import Gallery from '@sl/components/Gallery'
import { ImagesPanelProps } from './types'

const ImagesPanel = ({ images }: ImagesPanelProps) => (
    <Box className='p-1'>
        <Gallery images={images} />
    </Box>
)

export default ImagesPanel
