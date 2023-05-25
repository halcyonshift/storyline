import { MutableRefObject, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import Image from '@sl/components/Image'
import { SectionModel, WorkModel } from '@sl/db/models'
import { ExportDataType, FullWorkSectionType, StylesType } from '@sl/forms/Work/Export/types'

const Scenes = ({ scenes, settings, styles, parse }: FullWorkSectionType) => (
    <div>
        {scenes.map((scene, index) => (
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

const Chapters = ({ chapters, scenes, settings, styles, parse }: FullWorkSectionType) => (
    <div>
        {chapters.map((chapter) => (
            <div key={chapter.id}>
                {settings.chapterTitle ? (
                    <h2 style={styles.h2}>
                        {settings.chapterTitle
                            .replace('{{number}}', chapter.order.toString())
                            .replace('{{title}}', chapter.displayTitle)}
                    </h2>
                ) : null}
                <Scenes
                    scenes={scenes.filter((scene) => scene.section.id === chapter.id)}
                    settings={settings}
                    styles={styles}
                    parse={parse}
                />
            </div>
        ))}
    </div>
)

const Parts = ({ parts, chapters, scenes, settings, styles, parse }: FullWorkSectionType) => (
    <div>
        {parts.map((part) => (
            <div key={part.id}>
                <h1 style={styles.h1}>{part.title}</h1>
                <Chapters
                    chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                    scenes={scenes}
                    styles={styles}
                    settings={settings}
                    parse={parse}
                />
            </div>
        ))}
    </div>
)

const FullWork = ({
    forwardRef,
    settings,
    styles,
    parse
}: {
    forwardRef: MutableRefObject<HTMLElement>
    settings: ExportDataType | undefined
    styles?: StylesType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse?: (value: string) => any
}) => {
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const work = useRouteLoaderData('work') as WorkModel

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
                        {(() => {
                            if (parts.length > 1) {
                                return (
                                    <Parts
                                        parts={parts}
                                        chapters={chapters}
                                        scenes={scenes}
                                        settings={settings}
                                        styles={styles}
                                        parse={parse}
                                    />
                                )
                            } else if (chapters.length > 1) {
                                return (
                                    <Chapters
                                        chapters={chapters.filter(
                                            (chapter) => chapter.section.id === parts[0].id
                                        )}
                                        scenes={scenes}
                                        settings={settings}
                                        styles={styles}
                                        parse={parse}
                                    />
                                )
                            } else {
                                return (
                                    <Scenes
                                        scenes={scenes.filter(
                                            (scene) => scene.section.id === chapters[0].id
                                        )}
                                        settings={settings}
                                        styles={styles}
                                        parse={parse}
                                    />
                                )
                            }
                        })()}
                    </div>
                </div>
            ) : null}
        </Box>
    )
}

export default FullWork
