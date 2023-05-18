/* eslint-disable max-len */
import { useState } from 'react'
import { Box, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, LOCATION_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { status } from '@sl/theme/utils'
import useTabs from '../../Tabs/useTabs'
import { BlockType } from './types'

const Block = ({ location, index, fontWeight }: BlockType) => {
    const [show, setShow] = useState<boolean>(false)
    const children = useObservable(
        () => location.locations.observeWithColumns(['title', 'status']),
        [],
        []
    )
    const { loadTab, removeTab } = useTabs()
    const { t } = useTranslation()

    return (
        <Draggable draggableId={location.id} index={index}>
            {(provided) => (
                <List
                    dense
                    disablePadding
                    className='bg-white'
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <ListItem
                        {...provided.dragHandleProps}
                        title={location.name}
                        className='bg-slate-50 dark:bg-slate-600'
                        sx={{
                            borderLeft: `8px solid ${status(location.status, 500).color}`
                        }}
                        disablePadding
                        disableGutters
                        divider>
                        <ListItemText
                            primary={
                                <Box className='flex flex-grow pr-1'>
                                    <ListItemButton
                                        onClick={() => {
                                            loadTab({ id: location.id, mode: 'location' })
                                            setShow(!show)
                                        }}>
                                        <Typography
                                            sx={{ fontWeight: fontWeight < 400 ? 400 : fontWeight }}
                                            title={location.name}
                                            variant='body1'
                                            className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                                        overflow-hidden self-center'>
                                            {location.name}
                                        </Typography>
                                    </ListItemButton>
                                    <Stack direction='row'>
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.location.add'
                                            icon={LOCATION_ICONS.add}
                                            link={`location/${location.id}/add`}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.add'
                                            link={`addNote/location/${location.id}`}
                                            icon={NOTE_ICONS.add}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.location.edit'
                                            link={`location/${location.id}/edit`}
                                            icon={GLOBAL_ICONS.edit}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.location.delete'
                                            icon={GLOBAL_ICONS.delete}
                                            confirm={t('layout.work.panel.location.deleteConfirm', {
                                                name: location.displayName
                                            })}
                                            onClick={() => {
                                                removeTab(location.id)
                                                location.delete()
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            }
                        />
                    </ListItem>
                    {children.length ? (
                        show ? (
                            <Droppable droppableId={location.id} type='LOCATION'>
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        {children.map((location, index) => (
                                            <Block
                                                key={location.id}
                                                location={location}
                                                index={index}
                                                fontWeight={fontWeight - 400}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        ) : null
                    ) : (
                        <Droppable droppableId={location.id} type='LOCATION' isCombineEnabled>
                            {(provided) => (
                                <Box ref={provided.innerRef} {...provided.droppableProps}>
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    )}
                </List>
            )}
        </Draggable>
    )
}

export default Block
