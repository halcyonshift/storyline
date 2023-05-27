import { Fragment } from 'react'
import Progress from '@sl/components/Progress'
import SceneList from './SceneList'
import { ChapterListProps } from './types'

const ChapterList = ({ chapters, scenes }: ChapterListProps) => (
    <>
        {chapters.map((chapter) => (
            <Fragment key={chapter.id}>
                <Progress section={chapter} />
                <SceneList scenes={scenes.filter((scene) => scene.section.id === chapter.id)} />
            </Fragment>
        ))}
    </>
)

export default ChapterList
