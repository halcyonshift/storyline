import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import EditChapterView from './EditChapter'
import EditPartView from './EditPart'
import EditSceneView from './EditScene'

const EditSectionView = () => {
    const section = useRouteLoaderData('section') as SectionModel
    const { setShowTabs } = useTabs()

    useEffect(() => setShowTabs(false), [])

    if (section.isPart) {
        return <EditPartView part={section} />
    } else if (section.isChapter) {
        return <EditChapterView chapter={section} />
    } else {
        return <EditSceneView scene={section} />
    }
}

export default EditSectionView
