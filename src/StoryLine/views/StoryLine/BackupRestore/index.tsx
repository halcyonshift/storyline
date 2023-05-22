import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import * as Boxes from './Boxes'

const BackupRestoreView = () => (
    <Box className='p-4 grid grid-cols-2 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.BackupDb />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.RestoreDb />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.BackupWork />
            </Box>
        </Paper>
        <Paper elevation={1} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.RestoreWork />
            </Box>
        </Paper>
    </Box>
)
export default BackupRestoreView
