/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { Box, Stack, Typography } from '@mui/material'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'
import { GLOBAL_ICONS, NOTE_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import { Status } from '@sl/constants/status'
import { SectionModel, WorkModel } from '@sl/db/models'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        if (result.type === 'SCENE' && !result.destination.droppableId.startsWith('CHAPTER-'))
            return

        const batchUpdate: SectionModel[] = []
        let sourceSections: SectionModel[] = []

        if (result.type === 'PARTS') {
            sourceSections = parts
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

            destinationSections.map((item, index) => {
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

        sourceSections.map((item, index) => {
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

    const Part = ({ part, chapters, scenes, index }) => {
        const [show, setShow] = useState<boolean>(false)
        return (
            <Draggable draggableId={part.id} index={index}>
                {(provided) => (
                    <Box {...provided.draggableProps} ref={provided.innerRef}>
                        <Box className='flex flex-grow'>
                            <Typography
                                {...provided.dragHandleProps}
                                onClick={() => setShow(!show)}
                                variant='body1'
                                className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                            overflow-hidden self-center'>
                                {part.displayTitle}
                            </Typography>
                            <Stack direction='row'>
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.addChapter'
                                    icon={SECTION_ICONS.addChapter}
                                    onClick={() => {
                                        part.addChapter()
                                    }}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.note.add'
                                    link={`addNote/section/${part.id}`}
                                    icon={NOTE_ICONS.add}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.edit'
                                    link={`section/${part.id}/edit`}
                                    icon={GLOBAL_ICONS.edit}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.delete'
                                    icon={GLOBAL_ICONS.delete}
                                    confirm={t('layout.work.panel.section.deleteConfirm', {
                                        name: part.displayTitle
                                    })}
                                    onClick={async () => {
                                        await part.delete()
                                        navigate(`/works/${part.work.id}`)
                                    }}
                                />
                            </Stack>
                        </Box>
                        {show ? (
                            <Droppable droppableId={part.id} type='CHAPTERS'>
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        {chapters
                                            .filter((chapter) => chapter.section.id === part.id)
                                            .map((chapter, index) => (
                                                <Chapter
                                                    key={chapter.id}
                                                    chapter={chapter}
                                                    scenes={scenes}
                                                    index={index}
                                                />
                                            ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        ) : null}
                    </Box>
                )}
            </Draggable>
        )
    }

    const Chapter = ({ chapter, scenes, index }) => {
        const [show, setShow] = useState<boolean>(false)
        return (
            <Draggable draggableId={chapter.id} index={index}>
                {(provided) => (
                    <Box {...provided.draggableProps} ref={provided.innerRef}>
                        <Box className='flex flex-grow' {...provided.dragHandleProps}>
                            <Typography
                                onClick={() => setShow(!show)}
                                variant='body1'
                                className='flex-grow w-0 whitespace-nowrap text-ellipsis overflow-hidden self-center'>
                                {chapter.displayTitle}
                            </Typography>
                            <Stack spacing={0} direction='row'>
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.addScene'
                                    icon={SECTION_ICONS.addScene}
                                    onClick={() => {
                                        chapter.addScene()
                                    }}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.note.add'
                                    link={`addNote/section/${chapter.id}`}
                                    icon={NOTE_ICONS.add}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.edit'
                                    link={`section/${chapter.id}/edit`}
                                    icon={GLOBAL_ICONS.edit}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.delete'
                                    icon={GLOBAL_ICONS.delete}
                                    confirm={t('layout.work.panel.section.deleteConfirm', {
                                        name: chapter.displayTitle
                                    })}
                                    onClick={async () => {
                                        await chapter.delete()
                                        navigate(`/works/${chapter.work.id}`)
                                    }}
                                />
                            </Stack>
                        </Box>

                        {show ? (
                            <Droppable droppableId={chapter.id} type='SCENES'>
                                {(provided, snapshot) => (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`chapter-scenes ${
                                            snapshot.isDraggingOver ? 'is-dragging-over' : ''
                                        }`}>
                                        {scenes
                                            .filter((scene) => scene.section.id === chapter.id)
                                            .map((scene, index) => (
                                                <Scene key={scene.id} scene={scene} index={index} />
                                            ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        ) : null}
                    </Box>
                )}
            </Draggable>
        )
    }

    const Scene = ({ scene, index }) => {
        return (
            <Draggable draggableId={scene.id} index={index}>
                {(provided) => (
                    <Box {...provided.draggableProps} ref={provided.innerRef}>
                        <Box className='flex flex-grow' {...provided.dragHandleProps}>
                            <Typography
                                variant='body1'
                                className='flex-grow w-0 whitespace-nowrap text-ellipsis overflow-hidden self-center'>
                                {scene.displayTitle}
                            </Typography>
                            <Stack spacing={0} direction='row'>
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.note.add'
                                    link={`addNote/section/${scene.id}`}
                                    icon={NOTE_ICONS.add}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.edit'
                                    link={`section/${scene.id}/edit`}
                                    icon={GLOBAL_ICONS.edit}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.delete'
                                    icon={GLOBAL_ICONS.delete}
                                    confirm={t('layout.work.panel.section.deleteConfirm', {
                                        name: scene.displayTitle
                                    })}
                                    onClick={async () => {
                                        await scene.delete()
                                        navigate(`/works/${scene.work.id}`)
                                    }}
                                />
                            </Stack>
                        </Box>
                    </Box>
                )}
            </Draggable>
        )
    }

    return (
        <Panel
            action={
                <GroupToggle
                    label={'layout.work.panel.section.groupToggle'}
                    group={group}
                    setGroup={setGroup}
                />
            }
            navigation={navigation}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='root' direction='vertical' type='PARTS'>
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {parts.map((part, index) => (
                                <Part
                                    key={part.id}
                                    part={part}
                                    chapters={chapters}
                                    scenes={scenes}
                                    index={index}
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

export default SectionPanel
