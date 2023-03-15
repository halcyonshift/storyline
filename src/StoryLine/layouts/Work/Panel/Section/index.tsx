import { useEffect, useState } from 'react'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import Panel from '@sl/components/Panel'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'
import { SECTION_ICONS } from '@sl/constants/icons'
import { SectionModel, WorkModel } from '@sl/db/models'
import ChapterAccordion from './ChapterAccordion'
import PartAccordion from './PartAccordion'
import SceneList from './SceneList'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const SectionPanel = () => {
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [navigation, setNavigation] = useState<TooltipIconButtonProps[]>([])
    const work = useRouteLoaderData('work') as WorkModel

    const navigate = useNavigate()
    const tabs = useTabs()

    useEffect(() => {
        setParts(tabs.sections.filter((section) => section.isPart))
        setChapters(tabs.sections.filter((section) => section.isChapter))
        setScenes(tabs.sections.filter((section) => section.isScene))
    }, [tabs.sections])

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
        <Panel navigation={navigation}>
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
