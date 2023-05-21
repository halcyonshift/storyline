import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import * as Boxes from './Boxes'

const ImportWorkView = () => (
    // eslint-disable-next-line max-len
    <Box className='p-4 grid grid-cols-3 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.StoryLine />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.Bibisco />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>Scrivener</Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>Google</Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>ePub</Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>Ao3</Box>
        </Paper>
    </Box>
)
export default ImportWorkView
