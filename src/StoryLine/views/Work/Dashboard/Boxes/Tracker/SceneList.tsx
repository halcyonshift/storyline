import Progress from '@sl/components/Progress'
import { SceneListProps } from './types'

const SceneList = ({ scenes }: SceneListProps) => (
    <>
        {scenes.map((scene) => (
            <Progress key={scene.id} section={scene} />
        ))}
    </>
)

export default SceneList
