import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SectionModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/useTabs'
import ChapterView from './Chapter'
import PartView from './Part'
import SceneView from './Scene'

const SectionView = () => {
    const [section, setSection] = useState<SectionModel>()
    const params = useParams()
    const tabs = useTabs()

    useEffect(() => {
        const _section = tabs.sections.find((section) => section.id === params.section_id)
        setSection(_section)
    }, [params.section_id])

    if (!section) return null

    if (section.isPart) {
        return <PartView section={section} />
    } else if (section.isChapter) {
        return <ChapterView section={section} />
    } else {
        return <SceneView section={section} />
    }
}

export default SectionView
