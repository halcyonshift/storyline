import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import * as Boxes from './Boxes'

const LandingView = () => (
    <Box className='p-4 grid grid-cols-3 grid-rows-3 gap-4 flex-grow'>
        <Paper elevation={2} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.WordCharts />
            </Box>
        </Paper>
        <Paper elevation={2} className='relative row-span-3'>
            <Boxes.Deadlines />
        </Paper>
        <Paper elevation={2} className='relative  row-span-2'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.LastUpdated />
            </Box>
        </Paper>
        <Paper elevation={2} className='relative row-span-2'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.WordGoal />
            </Box>
        </Paper>
        <Paper elevation={2} className='relative'>
            <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                <Boxes.Random />
            </Box>
        </Paper>
    </Box>
)

export default LandingView
