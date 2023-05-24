import { MutableRefObject, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import Image from '@sl/components/Image'
import { SectionModel, WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'

const FullWork = ({
    forwardRef,
    settings,
    styles,
    parse
}: {
    forwardRef: MutableRefObject<HTMLElement>
    settings: ExportDataType | undefined
    styles?:
        | {
              h1: object
              h2: object
              h3: object
              sep: object
              p: object
              cover: object
              image: object
              page: object
          }
        | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse?: (value: string) => any
}) => {
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const work = useRouteLoaderData('work') as WorkModel

    const Parts = () => (
        <div>
            {parts.map((part) => (
                <div key={part.id}>
                    <h1 style={styles.h1}>{part.title}</h1>
                    <Chapters partId={part.id} />
                </div>
            ))}
        </div>
    )

    const Chapters = (props: { partId: string }) => (
        <div>
            {chapters
                .filter((chapter) => chapter.section.id === props.partId)
                .map((chapter) => (
                    <div key={chapter.id}>
                        {settings.chapterTitle ? (
                            <h2 style={styles.h2}>
                                {settings.chapterTitle
                                    .replace('{{number}}', chapter.order.toString())
                                    .replace('{{title}}', chapter.displayTitle)}
                            </h2>
                        ) : null}
                        <Scenes chapterId={chapter.id} />
                    </div>
                ))}
        </div>
    )

    const Scenes = (props: { chapterId: string }) => (
        <div>
            {scenes
                .filter((scene) => scene.section.id === props.chapterId)
                .map((scene, index) => (
                    <div key={scene.id}>
                        {settings.sceneSeparator && index !== 0 ? (
                            <p style={styles.sep}>{settings.sceneSeparator}</p>
                        ) : null}
                        <div style={styles.p} key={scene.id}>
                            {parse(scene.body)}
                        </div>
                    </div>
                ))}
        </div>
    )

    useEffect(() => {
        work.parts.fetch().then((parts) => setParts(parts))
        work.chapters.fetch().then((chapters) => setChapters(chapters))
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

    return (
        <Box className='h-0 w-0 overflow-hidden' ref={forwardRef}>
            {settings && styles ? (
                <div>
                    <div style={styles.cover}>
                        {work.image ? (
                            <Image path={work.image} style={styles.image} />
                        ) : (
                            <>
                                <h1 style={styles.h1}>{work.title}</h1>
                                {settings.author ? (
                                    <h3 style={styles.h3}>{settings.author}</h3>
                                ) : null}
                            </>
                        )}
                    </div>
                    <div style={styles.page}>
                        {scenes.length ? (
                            parts.length > 1 ? (
                                <Parts />
                            ) : chapters.length > 1 ? (
                                <Chapters partId={parts[0].id} />
                            ) : (
                                <Scenes chapterId={chapters[0].id} />
                            )
                        ) : null}
                    </div>
                </div>
            ) : null}
        </Box>
    )
}

export default FullWork
