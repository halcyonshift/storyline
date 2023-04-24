import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel } from '@sl/db/models'
import ChapterView from './Chapter'
import PartView from './Part'
import SceneView from './Scene'

const SectionView = () => {
    const section = useRouteLoaderData('section') as SectionModel

    if (section.isPart) {
        return <PartView />
    } else if (section.isChapter) {
        return <ChapterView />
    } else {
        return <SceneView section={section} />
    }
}

export default SectionView
