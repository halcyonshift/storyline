import { useLoaderData } from 'react-router-dom'
import { SectionModel } from '../../../../db/models'
import ChapterView from './Chapter'
import PartView from './Part'
import SceneView from './Scene'

const SectionView = () => {
    const section = useLoaderData() as SectionModel

    if (section.isPart) {
        return <PartView section={section} />
    } else if (section.isChapter) {
        return <ChapterView section={section} />
    } else {
        return <SceneView section={section} />
    }
}

export default SectionView
