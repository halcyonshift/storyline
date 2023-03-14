import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SectionModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/useTabs'
import EditChapterView from './EditChapter'
import EditPartView from './EditPart'
import EditSceneView from './EditScene'

const EditSectionView = () => {
    const params = useParams()
    const tabs = useTabs()
    const [section, setSection] = useState<SectionModel>()

    useEffect(() => {
        setSection(tabs.sections.find((section) => section.id === params.section_id))
    }, [params.section_id])

    if (!section) return null

    if (section.isPart) {
        return <EditPartView part={section} />
    } else if (section.isChapter) {
        return <EditChapterView chapter={section} />
    } else {
        return <EditSceneView scene={section} />
    }
}

export default EditSectionView
