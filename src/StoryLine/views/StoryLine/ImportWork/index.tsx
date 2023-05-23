import { Box, Paper, Typography } from '@mui/material'

import * as Boxes from './Boxes'

const WatchThisSpaceBox = ({ title }: { title: string }) => (
    <Box className='grid h-full place-items-center p-5'>
        <Typography variant='h6' className='text-slate-300 dark:text-slate-600'>
            {title}
        </Typography>
    </Box>
)

const ImportWorkView = () => (
    <Box className='p-4 grid grid-cols-3 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.EPub />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.Ao3 />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <WatchThisSpaceBox title='Google' />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.Bibisco />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <WatchThisSpaceBox title='Scrivener' />
            </Box>
        </Paper>
    </Box>
)
export default ImportWorkView
