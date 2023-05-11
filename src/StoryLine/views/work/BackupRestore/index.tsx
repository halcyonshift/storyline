import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

import * as Boxes from './Boxes'

const BackupRestoreView = () => {
    const { setShowTabs } = useTabs()

    useEffect(() => {
        setShowTabs(false)
    }, [])

    return (
        // eslint-disable-next-line max-len
        <Box className='p-4 grid grid-cols-2 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
            <Paper elevation={1}>
                <Boxes.Backup />
            </Paper>
            <Paper elevation={1}>
                <Boxes.Restore />
            </Paper>
            <Paper elevation={1} className='col-span-2'>
                <Boxes.ExportAs />
            </Paper>
        </Box>
    )
}
export default BackupRestoreView
