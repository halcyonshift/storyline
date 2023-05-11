import { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Collapse,
    Stack,
    Tabs as MuiTabs,
    Tab as MuiTab,
    Typography,
    styled,
    IconButton
} from '@mui/material'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import { getHex, spacing } from '@sl/theme/utils'
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
    const character = useObservable(
        () => work.character.observeWithColumns(['display_name', 'mode']),
        [],
        []
    )
    const item = useObservable(() => work.item.observeWithColumns(['name']), [], [])
    const location = useObservable(() => work.location.observeWithColumns(['name']), [], [])
    const note = useObservable(() => work.note.observeWithColumns(['title']), [], [])
    const section = useObservable(() => work.section.observeWithColumns(['title']), [], [])
    const settings = useSettings()

    const TabsContainer = styled(MuiTabs)(() => ({
        '.MuiTabs-flexContainer': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.23)',
            width: '100%',
            height: spacing[settings.getHeaderHeight() == 'h-12' ? 12 : 14],
            paddingTop: spacing[2],
            minWidth: 'max-content'
        }
    }))

    const Tab = styled(MuiTab)(() => {
        return {
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderTopLeftRadius: spacing[1],
            borderTopRightRadius: spacing[1],
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderBottom: 'none',
            margin: `0 0 0 ${spacing[2]}`,
            padding: `${spacing[2]} ${spacing[3]}`,
            minHeight: 0,
            '& :first-of-type': {
                flexGrow: 1
            },
            '&.Mui-selected': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
                backgroundColor: settings.isDark() ? '#121212' : getHex('white'),
                boxShadow: `0 2px 0 0px ${settings.isDark() ? '#121212' : getHex('white')}`
            }
        }
    })

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

    const getLabel = (tab: TabType) => {
        const data = {
            character,
            item,
            location,
            note,
            section
        }[tab.mode] as (CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel)[]

        return data.find((obj) => obj.id === tab.id)?.displayName || ''
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
        () => (
            <Collapse in={tabs.showTabs}>
                <Box
                    sx={{
                        maxWidth,
                        backgroundColor: settings.getHex(settings.isDark() ? 800 : 50)
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
                                    TabIndicatorProps={{ style: { display: 'none' } }}>
                                    {tabs.tabs.map((tab, index) => (
                                        <Draggable
                                            key={`${tab.id}-${index}`}
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
                                                            className='items-center'
                                                            spacing={2}>
                                                            <Typography
                                                                variant='body2'
                                                                className='max-w-[150px] truncate'
                                                                {...props.dragHandleProps}>
                                                                {tab.label || getLabel(tab)}
                                                            </Typography>
                                                            <IconButton
                                                                size='small'
                                                                color='secondary'
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    tabs.removeTab(tab.id)
                                                                }}>
                                                                {GLOBAL_ICONS.close}
                                                            </IconButton>
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
            </Collapse>
        ),
        [tabs.tabs, tabs.active, tabs.showTabs, maxWidth]
    )
}

export default Tabs
