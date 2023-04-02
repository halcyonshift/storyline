import { useEffect, useState } from 'react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'
import { SECTION_ICONS } from '@sl/constants/icons'
import { Status } from '@sl/constants/status'
import { SectionModel, WorkModel } from '@sl/db/models'
import ChapterAccordion from './ChapterAccordion'
import PartAccordion from './PartAccordion'
import SceneList from './SceneList'

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
        if (!result.destination) {
            return
        }
        const batchUpdate: SectionModel[] = []
        let newSections: SectionModel[] = []

        if (result.type === 'PARTS') {
            newSections = parts
        } else if (result.type.endsWith('-CHAPTERS') || result.type.endsWith('-SCENES')) {
            const sectionId = result.type.substring(0, result.type.lastIndexOf('-'))
            newSections = sections.filter((section) => section.section.id === sectionId)
        }

        const [reorderedPart] = newSections.splice(result.source.index, 1)
        newSections.splice(result.destination.index, 0, reorderedPart)
        newSections.map((item, index) => {
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
                <GroupToggle
                    label={'layout.work.panel.section.groupToggle'}
                    group={group}
                    setGroup={setGroup}
                />
            }
            navigation={navigation}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {parts.length > 1 ? (
                    <PartAccordion parts={parts} chapters={chapters} scenes={scenes} />
                ) : chapters.length > 1 ? (
                    <ChapterAccordion chapters={chapters} scenes={scenes} />
                ) : (
                    <SceneList scenes={scenes} />
                )}
            </DragDropContext>
        </Panel>
    )
}

export default SectionPanel
