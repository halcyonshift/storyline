import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import * as Boxes from './Boxes'

const DashboardView = () => {
    const { setShowTabs } = useTabs()

    useEffect(() => {
        setShowTabs(false)
    }, [])

    return (
        <Box className='p-4 grid grid-cols-3 grid-rows-3 gap-4 flex-grow bg-slate-50'>
            <Paper elevation={1} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.WordCharts />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative row-span-3'>
                <Box className='absolute top-0 left-0 right-0 bottom-0'>
                    <Boxes.Tracker />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative row-span-2'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.LastUpdated />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative row-span-2'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.Deadlines />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.Random />
                </Box>
            </Paper>
        </Box>
    )
}

export default DashboardView
