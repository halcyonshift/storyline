import { useEffect, useRef, useState } from 'react'
import jsPDF from 'jspdf'
import { Box } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel, WorkModel } from '@sl/db/models'
import { htmlParse } from '@sl/utils'
import ExportAsForm from '@sl/forms/Work/ExportAs'
import { ExportAsDataType } from '@sl/forms/Work/ExportAs/types'

const ExportAsBox = () => {
    const [settings, setSettings] = useState<ExportAsDataType | null>()
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const exportTemplateRef = useRef<HTMLDivElement>(null)
    const work = useRouteLoaderData('work') as WorkModel

    const Parts = () => (
        <div>
            {parts.map((part) => (
                <div key={part.id}>
                    <h1 style={{ textAlign: 'center' }}>{part.title}</h1>
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
                        {settings?.chapterTitle ? (
                            <h2 style={{ textAlign: settings?.chapterPosition || 'center' }}>
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
                        {settings?.sceneSeparator && index !== 0 ? (
                            <p style={{ textAlign: 'center' }}>{settings.sceneSeparator}</p>
                        ) : null}
                        <div
                            style={{
                                fontFamily: 'Arial',
                                fontSize: '10pt',
                                letterSpacing: '0.01px'
                            }}
                            key={scene.id}>
                            {htmlParse(scene.body)}
                        </div>
                    </div>
                ))}
        </div>
    )

    const generateExport = async (formSettings: ExportAsDataType) => {
        setSettings(formSettings)
        setIsGenerating(true)
    }

    const generatePDF = async (): Promise<void> => {
        if (!exportTemplateRef?.current) return

        const pdf = new jsPDF({
            unit: 'pt',
            putOnlyUsedFonts: true,
            compress: true
        })

        const source = exportTemplateRef.current

        await pdf.html(source, {
            autoPaging: 'text',
            margin: 56.7,
            windowWidth: 595,
            width: 481.6
        })

        pdf.save(work.title)
    }

    useEffect(() => {
        if (!isGenerating || !settings || !exportTemplateRef.current) return

        if (settings.mode === 'pdf') {
            generatePDF().then(() => {
                setIsGenerating(false)
                setSettings(null)
            })
        }
    }, [isGenerating, settings, exportTemplateRef.current])

    useEffect(() => {
        work.parts.fetch().then((parts) => setParts(parts))
        work.chapters.fetch().then((chapters) => setChapters(chapters))
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

    return (
        <Box className='flex items-center justify-center px-5 h-full'>
            <Box>
                {exportTemplateRef.current?.innerHTML ? (
                    <ExportAsForm
                        work={work}
                        generateExport={generateExport}
                        isGenerating={isGenerating}
                    />
                ) : null}
                <Box className='h-0 w-0 overflow-hidden'>
                    <div ref={exportTemplateRef}>
                        <h1 style={{ fontFamily: 'Arial', textAlign: 'center', fontSize: '16pt' }}>
                            {work.title}
                        </h1>
                        {settings?.author ? (
                            <h3
                                style={{
                                    fontFamily: 'Arial',
                                    textAlign: 'center',
                                    fontSize: '13pt'
                                }}>
                                {settings?.author}
                            </h3>
                        ) : null}
                        <hr style={{ marginTop: '10pt' }} />
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
                </Box>
            </Box>
        </Box>
    )
}

export default ExportAsBox
