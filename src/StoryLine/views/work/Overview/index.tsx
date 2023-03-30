import { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { OverviewViewOption, OverviewViewOptionType } from '@sl/constants/overviewView'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { SectionModel, WorkModel } from '@sl/db/models'
import Summary from './Summary'
import Timeline from './Timeline'

const OverviewView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [parts, setParts] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [view, setView] = useState<OverviewViewOptionType>(OverviewViewOption.SUMMARY)
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        setShowTabs(true)
        work.chapters.fetch().then((chapters) => setChapters(chapters))
        work.parts.fetch().then((parts) => setParts(parts))
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

    return (
        <Box className='p-5 border-t-8 border-slate-100'>
            <ButtonGroup disableElevation>
                <Button
                    variant={view === OverviewViewOption.SUMMARY ? 'contained' : 'outlined'}
                    onClick={() => setView(OverviewViewOption.SUMMARY)}>
                    {t('view.work.overview.summary.title')}
                </Button>
                <Button
                    variant={view === OverviewViewOption.TIMELINE ? 'contained' : 'outlined'}
                    onClick={() => setView(OverviewViewOption.TIMELINE)}>
                    {t('view.work.overview.timeline.title')}
                </Button>
            </ButtonGroup>
            {view === OverviewViewOption.SUMMARY ? (
                <Summary parts={parts} chapters={chapters} scenes={scenes} />
            ) : (
                <Timeline work={work} />
            )}
        </Box>
    )
}

export default OverviewView
