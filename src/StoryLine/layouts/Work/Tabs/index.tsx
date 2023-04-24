import { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Stack, Tabs as MuiTabs, Tab as MuiTab, Typography, styled } from '@mui/material'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import { WorkModel } from '@sl/db/models'
import { getHex } from '@sl/theme/utils'
import useTabs from './useTabs'
import useLayout from '../useLayout'
import { useRouteLoaderData } from 'react-router-dom'
import { TabType } from '../types'

const Tabs = () => {
    const { t } = useTranslation()
    const tabs = useTabs()
    const { windowWidth, panelWidth, navigationWidth } = useLayout()
    const [maxWidth, setMaxWidth] = useState<number>(windowWidth - (panelWidth + navigationWidth))
    const [tabIndex, setTabIndex] = useState<number>(0)
    const work = useRouteLoaderData('work') as WorkModel
    const characters = useObservable(
        () => work.character.observeWithColumns(['display_name', 'mode']),
        [],
        []
    )
    const items = useObservable(() => work.item.observeWithColumns(['name']), [], [])
    const locations = useObservable(() => work.location.observeWithColumns(['name']), [], [])
    const notes = useObservable(() => work.note.observeWithColumns(['title']), [], [])
    const sections = useObservable(() => work.section.observeWithColumns(['title']), [], [])

    const TabsContainer = styled(MuiTabs)(() => ({
        '.MuiTabs-flexContainer': {
            borderBottom: `1px solid  ${getHex('slate', 300)}`,
            width: '100%',
            minWidth: 'max-content'
        }
    }))

    const Tab = styled(MuiTab)(({ theme }) => ({
        border: `1px solid  ${theme.palette.common.black}`,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderBottom: 'none',
        margin: '10px 0 0 5px',
        padding: '8px 12px',
        minHeight: 0,
        '& :first-of-type': {
            flexGrow: 1
        },
        '&.Mui-selected': {
            borderColor: getHex('slate', 300),
            backgroundColor: getHex('white'),
            borderBottom: getHex('white'),
            boxShadow: `0 2px 0 0px ${getHex('white')}`
        }
    }))

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (result.destination.index === result.source.index) return

        const newTabs = Array.from(tabs.tabs)
        const [removed] = newTabs.splice(result.source.index, 1)
        newTabs.splice(result.destination.index, 0, removed)
        tabs.setTabs(newTabs)
        setTabIndex(result.destination.index)
        tabs.setActive(-1)
    }

    // eslint-disable-next-line complexity
    const getLabel = (tab: TabType) => {
        if (tab.link.startsWith('character/'))
            return characters.find((character) => character.id === tab.id)?.displayName || ''
        else if (tab.link.startsWith('item/'))
            return items.find((item) => item.id === tab.id)?.displayName || ''
        else if (tab.link.startsWith('location/'))
            return locations.find((item) => item.id === tab.id)?.displayName || ''
        else if (tab.link.startsWith('note/'))
            return notes.find((item) => item.id === tab.id)?.displayName || ''
        else if (tab.link.startsWith('section/'))
            return sections.find((item) => item.id === tab.id)?.displayName || ''
    }

    useEffect(() => {
        tabs.setActive(tabIndex)
        tabs.setShowTabs(Boolean(tabs.tabs.length))
    }, [tabIndex, tabs.active])

    useEffect(
        () => setMaxWidth(windowWidth - (panelWidth + navigationWidth)),
        [windowWidth, panelWidth, navigationWidth]
    )

    return useMemo(
        () =>
            tabs.showTabs ? (
                <Box
                    className='bg-slate-100'
                    sx={{
                        marginLeft: '1px',
                        maxWidth
                    }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId='tabs' direction='horizontal'>
                            {(props) => (
                                <TabsContainer
                                    ref={props.innerRef}
                                    {...props.droppableProps}
                                    value={tabs.active}
                                    onChange={(_, value) => tabs.setActive(value)}
                                    variant='scrollable'
                                    scrollButtons={false}
                                    aria-label={t('layout.work.tabs')}
                                    selectionFollowsFocus
                                    TabIndicatorProps={{
                                        style: {
                                            display: 'none',
                                            backgroundColor: getHex('slate', 100)
                                        }
                                    }}>
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
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        tabs.setActive(index)
                                                    }}
                                                    iconPosition='start'
                                                    wrapped
                                                    className={
                                                        index === tabs.active ? 'Mui-selected' : ''
                                                    }
                                                    label={
                                                        <Stack
                                                            direction='row'
                                                            className='justify-middle'
                                                            spacing={2}>
                                                            <Typography
                                                                variant='body2'
                                                                className='max-w-[150px] truncate'
                                                                {...props.dragHandleProps}>
                                                                {getLabel(tab)}
                                                            </Typography>
                                                            <CloseIcon
                                                                fontSize='small'
                                                                color='action'
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    tabs.removeTab(tab.id)
                                                                }}
                                                            />
                                                        </Stack>
                                                    }
                                                />
                                            )}
                                        </Draggable>
                                    ))}
                                    {props.placeholder}
                                </TabsContainer>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Box>
            ) : null,
        [tabs.tabs, tabs.active, tabs.showTabs, maxWidth]
    )
}

export default Tabs
