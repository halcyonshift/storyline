import { useEffect, useState } from 'react'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'
import { SectionModel, WorkModel } from '@sl/db/models'
import { SECTION_ICONS } from '@sl/constants/icons'
import { SectionPanelProps } from '../types'
import Panel from '../'
import ChapterAccordion from './ChapterAccordion'
import PartAccordion from './PartAccordion'
import SceneList from './SceneList'

const SectionPanel = ({ sections, loadTab }: SectionPanelProps) => {
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [navigation, setNavigation] = useState<TooltipIconButtonProps[]>([])
    const work = useRouteLoaderData('work') as WorkModel
    const navigate = useNavigate()

    useEffect(() => {
        setParts(sections.filter((section) => section.isPart))
        setChapters(sections.filter((section) => section.isChapter))
        setScenes(sections.filter((section) => section.isScene))
    }, [sections])

    useEffect(() => {
        const newNavigation: TooltipIconButtonProps[] = [
            {
                onClick: async () => {
                    const count = await work.parts.fetchCount()
                    const part = await work.addPart({
                        order: count + 1
                    })
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
                <PartAccordion
                    parts={parts}
                    chapters={chapters}
                    scenes={scenes}
                    loadTab={loadTab}
                />
            ) : chapters.length > 1 ? (
                <ChapterAccordion chapters={chapters} scenes={scenes} loadTab={loadTab} />
            ) : (
                <SceneList scenes={scenes} loadTab={loadTab} />
            )}
        </Panel>
    )
}

export default SectionPanel
