import { useEffect } from 'react'
import Box from '@mui/material/Box'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const LandingView = () => {
    const tabs = useTabs()

    useEffect(() => tabs.setShowTabs(false), [])

    return (
        <Box className='p-4 grid grid-cols-3 gap-4 flex-grow'>
            <Box className='bg-slate-200 rounded relative'>
                <Box className='absolute'>Statistics</Box>
            </Box>
            <Box className='bg-slate-200 rounded relative'>
                <Box className='absolute'>Characters</Box>
            </Box>
            <Box className='bg-slate-200 rounded relative'>
                <Box className='absolute'>Locations</Box>
            </Box>
            <Box className='bg-slate-200 rounded relative'>
                <Box className='absolute'>Items</Box>
            </Box>
            <Box className='bg-slate-200 rounded relative'>
                <Box className='absolute'>Notes</Box>
            </Box>
            <Box className='bg-slate-200 rounded relative'>
                <Box className='absolute'>Sections</Box>
            </Box>
        </Box>
    )
}

export default LandingView
