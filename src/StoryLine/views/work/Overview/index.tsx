import { useEffect, useState, SyntheticEvent } from 'react'
import { FilterList as FilterListIcon } from '@mui/icons-material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, IconButton, Menu, MenuItem, Tab, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { OverviewViewOption, OverviewViewOptionType } from '@sl/constants/overviewView'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { SectionModel, WorkModel } from '@sl/db/models'
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
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        setShowTabs(true)
        work.chapters.fetch().then((chapters) => setChapters(chapters))
        work.parts.fetch().then((parts) => setParts(parts))
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

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
                                <Box className='w-full flex justify-between'>
                                    <Typography variant='body2'>
                                        {t('view.work.overview.timeline.title')}
                                    </Typography>
                                    {value === OverviewViewOption.TIMELINE ? (
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
                <MenuItem>Filter</MenuItem>
            </Menu>
        </Box>
    )
}

export default OverviewView
