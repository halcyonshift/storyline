import { Fragment } from 'react'
import Progress from '@sl/components/Progress'

import ChapterList from './ChapterList'
import { PartListProps } from './types'

const PartList = ({ parts, chapters, scenes }: PartListProps) => (
    <>
        {parts.map((part) => (
            <Fragment key={part.id}>
                <Progress section={part} />
                <ChapterList
                    chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                    scenes={scenes}
                />
            </Fragment>
        ))}
    </>
)

export default PartList
