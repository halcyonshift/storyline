import { useState } from 'react'
import Box from '@mui/material/Box'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { LOCATION_ICONS } from '@sl/constants/icons'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import { LocationModel, WorkModel } from '@sl/db/models'
import Block from './Block'

const LocationPanel = () => {
    const [group, setGroup] = useState<boolean>(false)
    const database = useDatabase()
    const work = useRouteLoaderData('work') as WorkModel
    const locations = useObservable(
        () => work.location.extend(Q.sortBy('name', Q.asc)).observeWithColumns(['updated_at']),
        [],
        []
    )

    const handleDragEnd = async (result: DropResult) => {
        let moving: LocationModel, to: LocationModel | null

        if (result.combine) {
            moving = locations.find((location) => location.id === result.draggableId)
            to = locations.find((location) => location.id === result.combine.draggableId)
        } else if (result.destination) {
            moving = locations.find((location) => location.id === result.draggableId)
            to = locations.find((location) => location.id === result.destination.droppableId)
        } else {
            moving = locations.find((location) => location.id === result.draggableId)
            to = null
        }

        if (moving) {
            await database.write(async () => {
                await moving.update((location) => {
                    location.location.set(to)
                })
            })
        }
    }

    return (
        <Panel
            action={<GroupToggle group={group} setGroup={setGroup} />}
            navigation={[
                {
                    link: 'addLocation',
                    text: 'layout.work.panel.location.add',
                    icon: LOCATION_ICONS.add
                }
            ]}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='root' direction='vertical' type='ROOT' isCombineEnabled>
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {locations
                                .filter((location) => !location.location.id)
                                .map((location, index) => (
                                    <Block
                                        key={location.id}
                                        location={location}
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

export default LocationPanel
