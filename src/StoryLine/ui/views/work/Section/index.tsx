import { useLoaderData } from 'react-router-dom'
import { SectionModel } from '../../../../db/models'
import ChapterScreen from './Chapter'
import PartScreen from './Part'
import SceneScreen from './Scene'

const SectionScreen = () => {
    const section = useLoaderData() as SectionModel

    if (section.isPart) {
        return <PartScreen section={section} />
    } else if (section.isChapter) {
        return <ChapterScreen section={section} />
    } else {
        return <SceneScreen section={section} />
    }
}

export default SectionScreen
