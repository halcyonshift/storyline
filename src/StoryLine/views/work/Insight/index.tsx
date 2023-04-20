import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import * as Boxes from './Boxes'

const InsightView = () => {
    const { setShowTabs } = useTabs()

    useEffect(() => {
        setShowTabs(false)
    }, [])

    return (
        <Box className='p-4 grid grid-cols-2 grid-rows-3 gap-4 flex-grow bg-slate-100'>
            <Paper elevation={2} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.Words />
                </Box>
            </Paper>
            <Paper elevation={2} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.ChapterLength />
                </Box>
            </Paper>
            <Paper elevation={2} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.WordsByDay />
                </Box>
            </Paper>
            <Paper elevation={2} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    Character point of view (tab)
                </Box>
            </Paper>
            <Paper elevation={2} className='relative col-span-2'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    Character/Item/Note/Location distribution
                </Box>
            </Paper>
        </Box>
    )
}
export default InsightView
