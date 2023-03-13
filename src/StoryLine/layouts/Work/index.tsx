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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import useTabs, { TabsProvider } from './useTabs'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import Navigation from './Navigation'
import {
    CharacterPanel,
    ItemPanel,
    LocationPanel,
    NotePanel,
    SearchPanel,
    SectionPanel
} from './Panel'
import { TabbedWorkLayoutProps } from './types'

const WorkLayout = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const tabs = useTabs()

    const [currentPanel, setCurrentPanel] = useState<string | null>()

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (result.destination.index === result.source.index) return

        const newTabs = Array.from(tabs.tabs)
        const [removed] = newTabs.splice(result.source.index, 1)
        newTabs.splice(result.destination.index, 0, removed)
        tabs.setTabs(newTabs)
        tabs.setActive(result.destination.index)
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
                            {tabs.work.title}
                        </Typography>
                        <Typography variant='h6' onClick={() => navigate('/')}>
                            StoryLine
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
                {currentPanel === 'character' ? (
                    <CharacterPanel characters={tabs.characters} />
                ) : null}
                {currentPanel === 'item' ? <ItemPanel items={tabs.items} /> : null}
                {currentPanel === 'location' ? <LocationPanel locations={tabs.locations} /> : null}
                {currentPanel === 'note' ? <NotePanel notes={tabs.notes} /> : null}
                {currentPanel === 'search' ? <SearchPanel /> : null}
                {currentPanel === 'section' ? <SectionPanel sections={tabs.sections} /> : null}
                <Box className='flex flex-col flex-grow'>
                    {tabs.showTabs ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId='tabs'>
                                {(props) => (
                                    <Tabs
                                        ref={props.innerRef}
                                        {...props.droppableProps}
                                        value={tabs.active}
                                        onChange={(_, value) => tabs.setActive(value)}
                                        variant='scrollable'
                                        scrollButtons={false}
                                        aria-label={t('layout.work.tabs')}>
                                        {tabs.tabs.map((tab, index) => (
                                            <Draggable
                                                key={tab.id}
                                                draggableId={`id-${tab.id}`}
                                                index={index}
                                                disableInteractiveElementBlocking={true}>
                                                {(props) => (
                                                    <Tab
                                                        ref={props.innerRef}
                                                        {...props.draggableProps}
                                                        {...props.dragHandleProps}
                                                        onClick={() => tabs.setActive(index)}
                                                        iconPosition='start'
                                                        wrapped
                                                        label={
                                                            <Stack
                                                                direction='row'
                                                                className='justify-middle'
                                                                spacing={2}>
                                                                <Typography variant='body2'>
                                                                    {tab.label}
                                                                </Typography>
                                                                <CloseIcon
                                                                    fontSize='small'
                                                                    color='action'
                                                                    onClick={() =>
                                                                        tabs.removeTab(tab.id)
                                                                    }
                                                                />
                                                            </Stack>
                                                        }
                                                    />
                                                )}
                                            </Draggable>
                                        ))}
                                        {props.placeholder}
                                    </Tabs>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : null}
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
                .query(Q.where('work_id', workId), Q.sortBy('first_name', Q.asc))
                .observe(),
            items: database
                .get<ItemModel>('item')
                .query(Q.where('work_id', workId), Q.sortBy('name', Q.asc))
                .observe(),
            locations: database
                .get<LocationModel>('location')
                .query(Q.where('work_id', workId), Q.sortBy('name', Q.asc))
                .observe(),
            notes: database
                .get<NoteModel>('note')
                .query(Q.where('work_id', workId), Q.sortBy('title', Q.asc))
                .observe(),
            sections: database
                .get<SectionModel>('section')
                .query(Q.where('work_id', workId), Q.sortBy('order', Q.asc))
                .observe()
        }
    })(TabbedWorkLayout)
)
