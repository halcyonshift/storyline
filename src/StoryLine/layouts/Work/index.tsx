import { useRef, useState } from 'react'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { Outlet, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { type WorkModel } from '@sl/db/models'
import * as Panel from './Panel'
import Navigation from './Navigation'
import Tabs from './Tabs'
import { TabsProvider } from './Tabs/useTabs'

import { LayoutProvider } from './useLayout'

const WorkLayout = () => {
    const [currentPanel, setCurrentPanel] = useState<string | null>()
    const database = useDatabase()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const params = useParams()
    const navigationRef = useRef<HTMLElement>()
    const panelRef = useRef<HTMLElement>()
    const mainRef = useRef<HTMLElement>()
    const work = useObservable(
        () => database.get<WorkModel>('work').findAndObserve(params.work_id),
        useLoaderData() as WorkModel,
        []
    )

    return (
        <LayoutProvider navigationRef={navigationRef} panelRef={panelRef} mainRef={mainRef}>
            <TabsProvider>
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
                                    onClick={() => navigate(`/work/${work.id}`)}>
                                    {work.title}
                                </Typography>
                                <Typography variant='h6' onClick={() => navigate('/')}>
                                    {t('storyline')}
                                </Typography>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Box className='flex flex-grow'>
                        <Navigation
                            forwardRef={navigationRef}
                            currentPanel={currentPanel}
                            setCurrentPanel={setCurrentPanel}
                        />
                        <Box ref={panelRef} className='relative flex flex-col shrink-0'>
                            {currentPanel === 'character' ? <Panel.CharacterPanel /> : null}
                            {currentPanel === 'item' ? <Panel.ItemPanel /> : null}
                            {currentPanel === 'location' ? <Panel.LocationPanel /> : null}
                            {currentPanel === 'note' ? <Panel.NotePanel /> : null}
                            {currentPanel === 'search' ? <Panel.SearchPanel /> : null}
                            {currentPanel === 'section' ? <Panel.SectionPanel /> : null}
                        </Box>
                        <Box ref={mainRef} id='main' className='flex flex-col flex-grow'>
                            <Tabs />
                            <Box className='flex flex-grow h-0 overflow-auto'>
                                <Outlet />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </TabsProvider>
        </LayoutProvider>
    )
}

export default WorkLayout
