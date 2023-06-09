import { useEffect, useState } from 'react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { Box } from '@mui/material'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'
import { SECTION_ICONS } from '@sl/constants/icons'
import { Status } from '@sl/constants/status'
import { SectionModel, WorkModel } from '@sl/db/models'
import Block from './Block'
import Sprint from './Sprint'

const SectionPanel = () => {
    const [group, setGroup] = useState<boolean>(false)
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [navigation, setNavigation] = useState<TooltipIconButtonProps[]>([])
    const database = useDatabase()
    const work = useRouteLoaderData('work') as WorkModel
    const sections = useObservable(
        () => work.section.extend(Q.sortBy('order', Q.asc)).observeWithColumns(['title', 'status']),
        [],
        []
    )

    const navigate = useNavigate()

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        const batchUpdate: SectionModel[] = []
        let sourceSections: SectionModel[] = []

        if (result.type === 'ROOT') {
            if (parts.length > 1) {
                sourceSections = parts
            } else if (chapters.length > 1) {
                sourceSections = chapters
            } else {
                sourceSections = scenes
            }
        } else {
            sourceSections = sections.filter(
                (section) => section.section.id === result.source.droppableId
            )
        }

        const [reordered] = sourceSections.splice(result.source.index, 1)

        if (result.source.droppableId === result.destination.droppableId) {
            sourceSections.splice(result.destination.index, 0, reordered)
        } else {
            const destinationSections = sections.filter(
                (section) => section.section.id === result.destination.droppableId
            )

            destinationSections.splice(result.destination.index, 0, reordered)

            await database.write(async () => {
                await reordered.update((section) => {
                    section.section.set(
                        sections.find((section) => section.id === result.destination.droppableId)
                    )
                })
            })

            destinationSections.forEach((item, index) => {
                const section = sections.find((section) => section.id === item.id)
                if (section.order !== index + 1) {
                    batchUpdate.push(
                        section.prepareUpdate((section) => {
                            section.order = index + 1
                        })
                    )
                }
            })
        }

        sourceSections.forEach((item, index) => {
            const section = sections.find((section) => section.id === item.id)
            if (section.order !== index + 1) {
                batchUpdate.push(
                    section.prepareUpdate((section) => {
                        section.order = index + 1
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
        setParts(sections.filter((section) => section.isPart))
        setChapters(sections.filter((section) => section.isChapter))
        setScenes(
            sections.filter(
                (section) =>
                    section.isScene && (group === true || section.status !== Status.ARCHIVE)
            )
        )
    }, [sections, group])

    useEffect(() => {
        const newNavigation: TooltipIconButtonProps[] = [
            {
                onClick: async () => {
                    const part = await work.addPart()
                    navigate(`section/${part.id}/edit`)
                },
                text: 'layout.work.panel.section.addPart',
                icon: SECTION_ICONS.addPart
            }
        ]

        if (parts.length === 1) {
            newNavigation.push({
                text: 'layout.work.panel.section.addChapter',
                icon: SECTION_ICONS.addChapter,
                onClick: async () => {
                    parts[0].addChapter()
                }
            })

            if (chapters.length === 1) {
                newNavigation.push({
                    text: 'layout.work.panel.section.addScene',
                    icon: SECTION_ICONS.addScene,
                    onClick: async () => {
                        chapters[0].addScene()
                    }
                })
            }
        }
        setNavigation(newNavigation)
    }, [parts.length, chapters.length])

    return (
        <Panel
            action={
                <>
                    <Sprint work={work} />
                    <GroupToggle
                        label={'layout.work.panel.section.groupToggle'}
                        group={group}
                        setGroup={setGroup}
                    />
                </>
            }
            navigation={navigation}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='root' direction='vertical' type='ROOT'>
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {(() => {
                                if (parts.length > 1) {
                                    return parts.map((part, index) => (
                                        <Block
                                            key={part.id}
                                            section={part}
                                            index={index}
                                            fontWeight={900}
                                            group={group}
                                        />
                                    ))
                                } else if (chapters.length > 1) {
                                    return chapters.map((chapter, index) => (
                                        <Block
                                            key={chapter.id}
                                            section={chapter}
                                            index={index}
                                            fontWeight={500}
                                            group={group}
                                        />
                                    ))
                                } else {
                                    return scenes.map((scene, index) => (
                                        <Block
                                            key={scene.id}
                                            section={scene}
                                            index={index}
                                            fontWeight={400}
                                            group={group}
                                        />
                                    ))
                                }
                            })()}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Panel>
    )
}

export default SectionPanel
