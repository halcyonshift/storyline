/* eslint-disable max-len */
import { useState } from 'react'
import { Box, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { getHex, status, textColor } from '@sl/theme/utils'
import useTabs from '../../Tabs/useTabs'
import { BlockType } from './types'

const Block = ({ note, index, fontWeight }: BlockType) => {
    const [show, setShow] = useState<boolean>(false)
    const children = useObservable(() => note.notes.observeWithColumns(['title', 'status']), [], [])
    const { loadTab, removeTab } = useTabs()
    const { t } = useTranslation()

    return (
        <Draggable draggableId={note.id} index={index}>
            {(provided) => (
                <List
                    dense
                    disablePadding
                    className='bg-white'
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <ListItem
                        {...provided.dragHandleProps}
                        title={note.title}
                        className='bg-slate-50 dark:bg-slate-600'
                        sx={{
                            borderLeft: `8px solid ${status(note.status, 500).color}`
                        }}
                        disablePadding
                        disableGutters
                        divider>
                        <ListItemText
                            sx={
                                note.color
                                    ? {
                                          backgroundColor: note.color,
                                          color: textColor(
                                              note.color,
                                              getHex('white'),
                                              getHex('black')
                                          )
                                      }
                                    : {}
                            }
                            primary={
                                <Box className='flex flex-grow pr-1'>
                                    <ListItemButton
                                        onClick={() => {
                                            loadTab({ id: note.id, mode: 'note' })
                                            setShow(!show)
                                        }}>
                                        <Typography
                                            sx={{ fontWeight: fontWeight < 400 ? 400 : fontWeight }}
                                            title={note.title}
                                            variant='body1'
                                            className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                                        overflow-hidden self-center'>
                                            {note.title}
                                        </Typography>
                                    </ListItemButton>
                                    <Stack direction='row'>
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.add'
                                            icon={NOTE_ICONS.add}
                                            link={`addNote/note/${note.id}`}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.edit'
                                            link={`note/${note.id}/edit`}
                                            icon={GLOBAL_ICONS.edit}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.delete'
                                            icon={GLOBAL_ICONS.delete}
                                            confirm={t('layout.work.panel.note.deleteConfirm', {
                                                name: note.title
                                            })}
                                            onClick={() => {
                                                removeTab(note.id)
                                                note.delete()
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            }
                        />
                    </ListItem>
                    {children.length ? (
                        show ? (
                            <Droppable droppableId={note.id} type='NOTE' isCombineEnabled>
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        {children.map((note, index) => (
                                            <Block
                                                key={note.id}
                                                note={note}
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
                        <Droppable droppableId={note.id} type='NOTE'>
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
