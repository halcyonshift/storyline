import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel, WorkModel } from '@sl/db/models'
import EditChapterView from './EditChapter'
import EditPartView from './EditPart'
import EditSceneView from './EditScene'

const EditSectionView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const section = useRouteLoaderData('section') as SectionModel

    if (section.isPart) {
        return <EditPartView />
    } else if (section.isChapter) {
        return <EditChapterView />
    } else {
        return <EditSceneView />
    }
}

export default EditSectionView
