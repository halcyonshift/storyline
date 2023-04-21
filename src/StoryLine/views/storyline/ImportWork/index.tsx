import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import * as Boxes from './Boxes'

const ImportWorkView = () => (
    <Box className='p-4 grid grid-cols-2 grid-rows-2 gap-4 flex-grow bg-slate-100'>
        <Paper elevation={2} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.StoryLine />
            </Box>
        </Paper>
        <Paper elevation={2} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.Bibisco />
            </Box>
        </Paper>
    </Box>
)
export default ImportWorkView
