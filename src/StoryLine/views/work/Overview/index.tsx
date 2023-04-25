import { useEffect, useState, SyntheticEvent } from 'react'
import { FilterList as FilterListIcon } from '@mui/icons-material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, IconButton, Menu, Tab, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { OverviewViewOption, OverviewViewOptionType } from '@sl/constants/overviewView'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { SectionModel, WorkModel } from '@sl/db/models'
import TimelineFilterForm from '@sl/forms/Work/Overview/Timeline'
import Summary from './Summary'
import Timeline from './Timeline'

const PADDING = { padding: 0 }

const OverviewView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const [value, setValue] = useState<OverviewViewOptionType>(OverviewViewOption.SUMMARY)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [parts, setParts] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [table, setTable] = useState<string>('character')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [id, setId] = useState<string>('')
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        setShowTabs(true)
        work.chapters.fetch().then((chapters) => setChapters(chapters))
        work.parts.fetch().then((parts) => setParts(parts))
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateFilter = () => {
        //
    }

    const FLAG = true

    return (
        <Box className=' w-full'>
            <TabContext value={value}>
                <Box className='border-b'>
                    <TabList
                        variant='fullWidth'
                        onChange={(_: SyntheticEvent, newValue: string) => {
                            setValue(newValue as OverviewViewOptionType)
                        }}
                        aria-label=''>
                        <Tab
                            label={t('view.work.overview.summary.title')}
                            value={OverviewViewOption.SUMMARY}
                        />
                        <Tab
                            label={
                                <Box className='w-full _flex _justify-between'>
                                    <Typography variant='body2'>
                                        {t('view.work.overview.timeline.title')}
                                    </Typography>
                                    {value === OverviewViewOption.TIMELINE && !FLAG ? (
                                        <IconButton
                                            sx={{ padding: 0 }}
                                            id='filter-button'
                                            aria-controls={anchorEl ? 'filter-menu' : undefined}
                                            aria-haspopup='true'
                                            aria-expanded={anchorEl ? 'true' : undefined}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setAnchorEl(e.currentTarget)
                                            }}>
                                            <FilterListIcon fontSize='small' />
                                        </IconButton>
                                    ) : null}
                                </Box>
                            }
                            value={OverviewViewOption.TIMELINE}
                        />
                    </TabList>
                </Box>
                <TabPanel value={OverviewViewOption.SUMMARY}>
                    <Summary parts={parts} chapters={chapters} scenes={scenes} />
                </TabPanel>
                <TabPanel value={OverviewViewOption.TIMELINE} sx={PADDING}>
                    <Timeline work={work} />
                </TabPanel>
            </TabContext>
            <Menu
                id='filter-menu'
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'filter-button'
                }}>
                <Box className='px-3 pb-2'>
                    <TimelineFilterForm
                        work={work}
                        setAnchorEl={setAnchorEl}
                        table={table}
                        setTable={setTable}
                        setId={setId}
                    />
                </Box>
            </Menu>
        </Box>
    )
}

export default OverviewView
