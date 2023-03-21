import { useState, Suspense } from 'react'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { type Database, Q } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import {
    type CharacterModel,
    type ItemModel,
    type LocationModel,
    type NoteModel,
    type SectionModel,
    type WorkModel
} from '@sl/db/models'
import * as Panel from './Panel'
import Navigation from './Navigation'
import Tabs from './Tabs'
import useTabs, { TabsProvider } from './Tabs/useTabs'
import { TabbedWorkLayoutProps } from './types'

const WorkLayout = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const tabs = useTabs()

    const [currentPanel, setCurrentPanel] = useState<string | null>()

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
                            {GLOBAL_ICONS.back}
                        </IconButton>
                    </Box>
                    <Box className='flex flex-grow justify-between'>
                        <Typography
                            variant='h6'
                            className='w-[70vw] text-ellipsis'
                            onClick={() => navigate(`/works/${tabs.work.id}`)}>
                            {tabs.work.title}
                        </Typography>
                        <Typography variant='h6' onClick={() => navigate('/')}>
                            {t('storyline')}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className='flex flex-grow'>
                <Navigation
                    work={tabs.work}
                    currentPanel={currentPanel}
                    setCurrentPanel={setCurrentPanel}
                />
                {currentPanel === 'character' ? <Panel.CharacterPanel /> : null}
                {currentPanel === 'item' ? <Panel.ItemPanel /> : null}
                {currentPanel === 'location' ? <Panel.LocationPanel /> : null}
                {currentPanel === 'note' ? <Panel.NotePanel /> : null}
                {currentPanel === 'search' ? <Panel.SearchPanel /> : null}
                {currentPanel === 'section' ? <Panel.SectionPanel /> : null}
                <Box className='flex flex-col flex-grow'>
                    <Tabs />
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

const TabbedWorkLayout = ({
    characters,
    items,
    locations,
    notes,
    sections,
    work
}: TabbedWorkLayoutProps) => (
    <TabsProvider
        characters={characters}
        items={items}
        locations={locations}
        notes={notes}
        sections={sections}
        work={work}>
        <WorkLayout />
    </TabsProvider>
)

export default withDatabase(
    withObservables([], ({ database }: { database: Database }) => {
        const workId: string = location.hash.split('/')[2]

        return {
            work: database.get<WorkModel>('work').findAndObserve(workId),
            characters: database
                .get<CharacterModel>('character')
                .query(Q.where('work_id', workId), Q.sortBy('display_name', Q.asc))
                .observeWithColumns(['display_name', 'status']),
            items: database
                .get<ItemModel>('item')
                .query(Q.where('work_id', workId), Q.sortBy('name', Q.asc))
                .observeWithColumns(['name', 'status']),
            locations: database
                .get<LocationModel>('location')
                .query(Q.where('work_id', workId), Q.sortBy('name', Q.asc))
                .observeWithColumns(['name', 'status']),
            notes: database
                .get<NoteModel>('note')
                .query(Q.where('work_id', workId), Q.sortBy('order', Q.asc))
                .observeWithColumns(['title', 'status', 'order']),
            sections: database
                .get<SectionModel>('section')
                .query(Q.where('work_id', workId), Q.sortBy('order', Q.asc))
                .observeWithColumns(['title', 'status', 'order', 'updated_at'])
        }
    })(TabbedWorkLayout)
)
