import { useEffect, useState } from 'react'
import * as Q from '@nozbe/watermelondb/QueryDescription'
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
    const work = useRouteLoaderData('work') as WorkModel
    const sections = useObservable(
        () =>
            work.section
                .extend(Q.sortBy('order', Q.asc))
                .observeWithColumns(['title', 'status', 'order', 'updated_at']),
        [],
        []
    )
    const navigate = useNavigate()

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
            {parts.length > 1 ? (
                <PartAccordion parts={parts} chapters={chapters} scenes={scenes} />
            ) : chapters.length > 1 ? (
                <ChapterAccordion chapters={chapters} scenes={scenes} />
            ) : (
                <SceneList scenes={scenes} />
            )}
        </Panel>
    )
}

export default SectionPanel
