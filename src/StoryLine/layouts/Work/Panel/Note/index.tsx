/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { Box, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { NoteModel, WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { status } from '@sl/theme/utils'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { NodeType, NodeGroupType } from './types'

const NotePanel = () => {
    const [group, setGroup] = useState<boolean>(false)
    const work = useRouteLoaderData('work') as WorkModel
    const database = useDatabase()
    const { t } = useTranslation()
    const { loadTab, removeTab } = useTabs()
    const notes = useObservable(
        () =>
            work.note
                .extend(
                    Q.where('character_id', null),
                    Q.where('item_id', null),
                    Q.where('location_id', null),
                    Q.where('section_id', null),
                    Q.sortBy('order', Q.asc)
                )
                .observeWithColumns(['title', 'status', 'order', 'color']),
        [],
        []
    )
    const [list, setList] = useState<NoteModel[]>(notes)

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return
        }

        const batchUpdate: NoteModel[] = []
        const newNotes = notes.filter((note) => !group || !note.note.id)
        const [reorderedPart] = newNotes.splice(result.source.index, 1)
        newNotes.splice(result.destination.index, 0, reorderedPart)
        newNotes.map((item, index) => {
            const note = notes.find((note) => note.id === item.id)
            if (note.order !== index + 1) {
                batchUpdate.push(
                    note.prepareUpdate((note) => {
                        note.order = index + 1
                    })
                )
            }
        })

        if (batchUpdate.length) {
            await database.write(async () => {
                await database.batch(batchUpdate)
            })
        }
    }

    useEffect(() => {
        const tree = ((data, root: string) => {
            const r: NodeType[] = [],
                o: NodeGroupType = {}
            data.forEach((a) => {
                const parentId = a.note.id || null
                o[a.id] = { data: a, children: o[a.id] && o[a.id].children }
                if (parentId === root) {
                    r.push(o[a.id])
                } else {
                    o[parentId] = o[parentId] || {}
                    o[parentId].children = o[parentId].children || []
                    o[parentId].children.push(o[a.id])
                }
            })
            return r
        })(
            notes.sort((a, b) => a.order - b.order),
            null
        )
        setList(
            tree.reduce(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (function traverse(level): any {
                    return (r: NoteModel[], a: NodeType) => {
                        a.data.level = level
                        return r.concat(a.data, (a.children || []).reduce(traverse(level + 1), []))
                    }
                })(0),
                []
            )
        )
    }, [group, notes])

    return (
        <Panel
            action={<GroupToggle group={group} setGroup={setGroup} />}
            navigation={[
                { link: 'addNote', text: 'layout.work.panel.note.add', icon: NOTE_ICONS.add }
            ]}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='note-list'>
                    {(provided) => (
                        <List
                            dense
                            disablePadding
                            className='bg-white'
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            {list
                                .filter((note) => group || !note.note.id)
                                .map((note, index) => (
                                    <Draggable key={note.id} draggableId={note.id} index={index}>
                                        {(provided) => (
                                            <ListItem
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                disablePadding
                                                disableGutters
                                                divider
                                                sx={{
                                                    borderLeft: `8px solid ${
                                                        note.color || status(note.status).color
                                                    }`
                                                }}>
                                                <ListItemText
                                                    primary={
                                                        <Box
                                                            className='flex justify-between align-middle'
                                                            sx={{
                                                                paddingLeft: note.level,
                                                                backgroundColor: status(note.status)
                                                                    .color
                                                            }}>
                                                            <ListItemButton
                                                                onClick={() =>
                                                                    loadTab({
                                                                        id: note.id,
                                                                        label: note.title,
                                                                        link: `note/${note.id}`
                                                                    })
                                                                }>
                                                                <Typography
                                                                    variant='body1'
                                                                    className='whitespace-nowrap text-ellipsis
                                            overflow-hidden'
                                                                    {...provided.dragHandleProps}>
                                                                    {note.title}
                                                                </Typography>
                                                            </ListItemButton>
                                                            <Stack spacing={0} direction='row'>
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
                                                                    confirm={t(
                                                                        'layout.work.panel.note.deleteConfirm',
                                                                        {
                                                                            name: note.title
                                                                        }
                                                                    )}
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
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
        </Panel>
    )
}

export default NotePanel
