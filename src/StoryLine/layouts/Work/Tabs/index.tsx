import CloseIcon from '@mui/icons-material/Close'
import Stack from '@mui/material/Stack'
import { Tabs as MuiTabs } from '@mui/material'
import Tab from '@mui/material/Tab'

import Typography from '@mui/material/Typography'

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

import { useTranslation } from 'react-i18next'

import useTabs from './useTabs'

const Tabs = () => {
    const { t } = useTranslation()
    const tabs = useTabs()

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
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='tabs'>
                {(props) => (
                    <MuiTabs
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
                                        onClick={() => tabs.setActive(index)}
                                        iconPosition='start'
                                        wrapped
                                        label={
                                            <Stack
                                                direction='row'
                                                className='justify-middle'
                                                spacing={2}>
                                                <Typography
                                                    variant='body2'
                                                    {...props.dragHandleProps}>
                                                    {tab.label}
                                                </Typography>
                                                <CloseIcon
                                                    fontSize='small'
                                                    color='action'
                                                    onClick={() => tabs.removeTab(tab.id)}
                                                />
                                            </Stack>
                                        }
                                    />
                                )}
                            </Draggable>
                        ))}
                        {props.placeholder}
                    </MuiTabs>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default Tabs
