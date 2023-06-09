import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useLayout from '@sl/layouts/Work/useLayout'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import * as Boxes from './Boxes'

const ExportView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const { setBreadcrumbs, setTitle } = useLayout()
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        setShowTabs(false)
        setTitle(t('layout.work.navigation.export'))
        setBreadcrumbs([])
    }, [])

    return (
        <Box
            className='p-4 grid grid-cols-3 grid-rows-3 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'
            id='exportView'>
            <Paper elevation={1}>
                <Boxes.Docx work={work} />
            </Paper>
            <Paper elevation={1}>
                <Boxes.EPub work={work} />
            </Paper>
            <Paper elevation={1}>
                <Boxes.HTML work={work} />
            </Paper>
            <Paper elevation={1}>
                <Boxes.Markdown work={work} />
            </Paper>
            <Paper elevation={1}>
                <Boxes.PDF work={work} />
            </Paper>
            <Paper elevation={1}>
                <Boxes.Text work={work} />
            </Paper>
        </Box>
    )
}
export default ExportView
