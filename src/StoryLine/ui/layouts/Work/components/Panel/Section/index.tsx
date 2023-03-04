import { useEffect, useState } from 'react'
import { TooltipIconButtonProps } from '../../../../../components/TooltipIconButton/types'
import { SectionModel } from '../../../../../../db/models'
import { SECTION_ICONS } from '../../../../../icons'
import { SectionPanelProps } from '../types'
import Panel from '../'

import { ChapterAccordion, PartAccordion, SceneList } from './components'

const SectionPanel = ({ sections, loadTab }: SectionPanelProps) => {
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [navigation, setNavigation] = useState<TooltipIconButtonProps[]>([])

    useEffect(() => {
        setParts(sections.filter((section) => section.isPart))
        setChapters(sections.filter((section) => section.isChapter))
        setScenes(sections.filter((section) => section.isScene))
    }, [sections])

    useEffect(() => {
        const newNavigation: TooltipIconButtonProps[] = [
            {
                link: 'addPart',
                text: 'layout.work.panel.section.addPart',
                icon: SECTION_ICONS.addPart
            }
        ]

        if (parts.length === 1) {
            newNavigation.push({
                link: 'section/add/chapter',
                text: 'layout.work.panel.section.addChapter',
                icon: SECTION_ICONS.addChapter
            })
        }

        if (chapters.length === 1) {
            newNavigation.push({
                link: 'section/add/scene',
                text: 'layout.work.panel.section.addScene',
                icon: SECTION_ICONS.addScene
            })
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
