import { useState } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { type Database, Q } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'

import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '../../../db/models'
import Navigation from './components/Navigation'
import { CharacterPanel, ItemPanel, LocationPanel, SectionPanel } from './components/Panel'
import { TabType, WorkLayoutProps } from './types'

const hasTabs = ['character', 'item', 'location', 'note', 'section']

const WorkLayout = ({ characters, items, locations, sections, work }: WorkLayoutProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [currentPanel, setCurrentPanel] = useState<string | null>()
    const [currentTab, setCurrentTab] = useState<number>(0)
    const [tabs, setTabs] = useState<TabType[]>([])

    const loadTab = (focusTab: TabType) => {
        const focus = tabs.findIndex((tab) => tab.id === focusTab.id)
        if (focus === -1) {
            setTabs(tabs.concat([focusTab]))
            setCurrentTab(tabs.length)
        } else {
            setCurrentTab(focus)
        }

        navigate(`/works/${work.id}/${focusTab.link}`)
    }

    const removeTab = (id: string) => {
        const tabIndex = tabs.findIndex((tab) => tab.id === id)

        let newIndex = 0

        if (tabIndex > 0) {
            newIndex = tabIndex - 1
        } else if (tabIndex < tabIndex - 1) {
            newIndex = newIndex = tabIndex + 1
        }

        const newTabs = tabs.filter((tab) => tab.id !== id)
        setTabs(newTabs)

        if (newTabs.length) {
            loadTab(newTabs[newIndex])
        } else {
            navigate(`/works/${work.id}`)
        }
    }

    return (
        <Box className={`flex flex-col flex-grow`}>
            <AppBar position='static' color='transparent' className='z-10'>
                <Toolbar variant='dense'>
                    <Box>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label={t('navigation.back')}
                            onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Box>
                    <Box className='flex flex-grow justify-between'>
                        <Typography variant='h6' className='w-[70vw] text-ellipsis'>
                            {work.title}
                        </Typography>
                        <Typography variant='h6' onClick={() => navigate('/')}>
                            StoryLine
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className='flex flex-grow'>
                <Navigation
                    work={work}
                    currentPanel={currentPanel}
                    setCurrentPanel={setCurrentPanel}
                />
                {currentPanel ? (
                    <Box className='flex flex-col bg-indigo-50 border-r-slate-400 border-r w-1/5'>
                        {currentPanel === 'character' ? (
                            <CharacterPanel loadTab={loadTab} characters={characters} />
                        ) : null}
                        {currentPanel === 'item' ? (
                            <ItemPanel loadTab={loadTab} items={items} />
                        ) : null}
                        {currentPanel === 'location' ? (
                            <LocationPanel loadTab={loadTab} locations={locations} />
                        ) : null}
                        {currentPanel === 'section' ? (
                            <SectionPanel loadTab={loadTab} sections={sections} />
                        ) : null}
                    </Box>
                ) : null}
                <Box className='flex flex-col flex-grow'>
                    {tabs.length && hasTabs.includes(currentPanel) ? (
                        <Tabs
                            value={currentTab}
                            onChange={(_, value) => setCurrentTab(value)}
                            variant='scrollable'
                            scrollButtons={false}
                            aria-label={t('layout.work.tabs')}>
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.id}
                                    iconPosition='start'
                                    wrapped
                                    label={
                                        <Stack
                                            direction='row'
                                            className='justify-middle'
                                            spacing={2}>
                                            <Typography variant='body2'>{tab.label}</Typography>
                                            <CloseIcon
                                                fontSize='small'
                                                color='action'
                                                onClick={() => removeTab(tab.id)}
                                            />
                                        </Stack>
                                    }
                                />
                            ))}
                        </Tabs>
                    ) : null}
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default withDatabase(
    withObservables([], ({ database }: { database: Database }) => {
        const workId: string = location.hash.split('/')[2]

        return {
            work: database.get<WorkModel>('work').findAndObserve(workId),
            characters: database
                .get<CharacterModel>('character')
                .query(Q.where('work_id', workId))
                .observe(),
            items: database.get<ItemModel>('item').query(Q.where('work_id', workId)).observe(),
            locations: database
                .get<LocationModel>('location')
                .query(Q.where('work_id', workId))
                .observe(),
            notes: database.get<NoteModel>('note').query(Q.where('work_id', workId)).observe(),
            sections: database
                .get<SectionModel>('section')
                .query(Q.where('work_id', workId))
                .observe()
        }
    })(WorkLayout)
)
