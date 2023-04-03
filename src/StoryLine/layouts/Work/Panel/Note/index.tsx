/* eslint-disable max-len */
import { useState } from 'react'
import { Box } from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import { NOTE_ICONS } from '@sl/constants/icons'
import { NoteModel, WorkModel } from '@sl/db/models'
import { useDatabase } from '@nozbe/watermelondb/hooks'

import Block from './Block'

const NotePanel = () => {
    const [group, setGroup] = useState<boolean>(false)
    const work = useRouteLoaderData('work') as WorkModel
    const database = useDatabase()
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

    const handleDragEnd = async (result: DropResult) => {
        /*
        if (result.combine) {
            const moveNote = notes.find((note) => note.id === result.draggableId)

            await database.write(async () => {
                await moveNote.update((note) => {
                    note.note.set(notes.find((note) => note.id === result.combine.draggableId))
                })
            })

            return
        }
        */
        if (!result.destination) return

        const batchUpdate: NoteModel[] = []
        let sourceNotes: NoteModel[] = []

        if (result.type === 'ROOT') {
            sourceNotes = notes.filter((note) => !note.note.id)
        } else {
            sourceNotes = notes.filter((note) => note.note.id === result.source.droppableId)
        }

        const [reordered] = sourceNotes.splice(result.source.index, 1)

        if (result.source.droppableId === result.destination.droppableId) {
            sourceNotes.splice(result.destination.index, 0, reordered)
        } else {
            const destinationNotes = notes.filter(
                (note) => note.note.id === result.destination.droppableId
            )

            destinationNotes.splice(result.destination.index, 0, reordered)

            await database.write(async () => {
                await reordered.update((note) => {
                    note.note.set(notes.find((note) => note.id === result.destination.droppableId))
                })
            })

            destinationNotes.map((item, index) => {
                const note = notes.find((note) => note.id === item.id)
                if (note.order !== index + 1) {
                    batchUpdate.push(
                        note.prepareUpdate((note) => {
                            note.order = index + 1
                        })
                    )
                }
            })
        }

        sourceNotes.map((item, index) => {
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

    return (
        <Panel
            action={<GroupToggle group={group} setGroup={setGroup} />}
            navigation={[
                { link: 'addNote', text: 'layout.work.panel.note.add', icon: NOTE_ICONS.add }
            ]}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='root' direction='vertical' type='ROOT' isCombineEnabled>
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {notes
                                .filter((note) => !note.note.id)
                                .map((note, index) => (
                                    <Block
                                        key={note.id}
                                        note={note}
                                        index={index}
                                        fontWeight={900}
                                    />
                                ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Panel>
    )
}

export default NotePanel
