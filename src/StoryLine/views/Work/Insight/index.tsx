import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import useLayout from '@sl/layouts/Work/useLayout'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import * as Boxes from './Boxes'

const InsightView = () => {
    const { setBreadcrumbs, setTitle } = useLayout()
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        setShowTabs(false)
        setTitle(t('layout.work.navigation.insight'))
        setBreadcrumbs([])
    }, [])

    return (
        <Box className='p-4 grid grid-cols-2 grid-rows-3 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
            <Paper elevation={1} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-visible'>
                    <Boxes.Words />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative row-span-3'>
                <Box className='absolute top-0 left-0 right-0 bottom-0'>
                    <Boxes.Spread />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.ChapterLength />
                </Box>
            </Paper>
            <Paper elevation={1} className='relative'>
                <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto'>
                    <Boxes.PointOfView />
                </Box>
            </Paper>
        </Box>
    )
}
export default InsightView
