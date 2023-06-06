import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Outlet, useLoaderData, useParams } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { type WorkModel } from '@sl/db/models'
import AppBar from './Bar'
import * as Panel from './Panel'
import Navigation from './Navigation'
import Tabs from './Tabs'
import { TabsProvider } from './Tabs/useTabs'
import { LayoutProvider } from './useLayout'
import packageJSON from '../../../../package.json'

const WorkLayout = () => {
    const [currentPanel, setCurrentPanel] = useState<string | null>()
    const database = useDatabase()
    const params = useParams()
    const navigationRef = useRef<HTMLElement>()
    const panelRef = useRef<HTMLElement>()
    const mainRef = useRef<HTMLElement>()
    const work = useObservable(
        () => database.get<WorkModel>('work').findAndObserve(params.work_id),
        useLoaderData() as WorkModel,
        []
    )

    useEffect(() => {
        api.setTitle(`${packageJSON.productName}: ${work.title}`)
    }, [])

    return (
        <LayoutProvider navigationRef={navigationRef} panelRef={panelRef} mainRef={mainRef}>
            <TabsProvider>
                <Box className='flex flex-col flex-grow'>
                    <AppBar />
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
