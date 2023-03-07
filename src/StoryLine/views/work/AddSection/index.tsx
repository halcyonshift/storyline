import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel, WorkModel } from '@sl/db/models'
import AddChapterView from './AddChapter'
import AddPartView from './AddPart'
import AddSceneView from './AddScene'

const AddSectionView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const section = useRouteLoaderData('section') as SectionModel

    if (section.isPart) {
        return <AddPartView />
    } else if (section.isChapter) {
        return <AddChapterView />
    } else {
        return <AddSceneView />
    }
}

export default AddSectionView
