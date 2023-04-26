import { useCallback, useEffect, useRef, useState, CSSProperties } from 'react'
import jsPDF from 'jspdf'
import { Box } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import Image from '@sl/components/Image'
import { SectionModel, WorkModel } from '@sl/db/models'
import { htmlParse, exportDocxParse, exportHTMLParse } from '@sl/utils'
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
                    <h1 style={getStyles()?.h1}>{part.title}</h1>
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
                            <h2 style={getStyles()?.h2}>
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
                            <p style={getStyles().sep}>{settings.sceneSeparator}</p>
                        ) : null}
                        <div style={getStyles()?.p} key={scene.id}>
                            {settings?.mode === 'html'
                                ? exportHTMLParse(scene.body, settings)
                                : settings?.mode === 'docx'
                                ? exportDocxParse(scene.body)
                                : htmlParse(scene.body)}
                        </div>
                    </div>
                ))}
        </div>
    )

    const wrapHTML = () => {
        if (!exportTemplateRef?.current) return

        // eslint-disable-next-line max-len
        return `<!DOCTYPE html><html><head><title>${work.title}</title></head><body>${exportTemplateRef.current.innerHTML}</body></html>`
    }

    const generateExport = async (formSettings: ExportAsDataType) => {
        setSettings(formSettings)
        setIsGenerating(true)
    }

    const generateDocx = async (): Promise<void> => {
        if (!exportTemplateRef?.current) return

        api.exportDocx(work.title, wrapHTML())
    }

    const generateHTML = async (): Promise<void> => {
        if (!exportTemplateRef?.current) return
        api.exportHTML(work.title, wrapHTML())
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

    const getStyles = useCallback(() => {
        const fontFamily = settings?.font || 'arial'
        const textAlign = settings?.chapterPosition || 'center'

        const defaultStyle = {
            h1: { textAlign, fontFamily } as CSSProperties,
            h2: {
                textAlign,
                fontFamily
            } as CSSProperties,
            h3: {
                textAlign,
                fontFamily,
                fontSize: '13pt'
            } as CSSProperties,
            sep: { textAlign: 'center', fontFamily } as CSSProperties,
            p: {
                fontFamily,
                fontSize: settings?.fontSize || '12pt',
                lineHeight: { normal: 1.2, relaxed: 1.6, loose: 1.8 }[
                    settings?.lineHeight || 'normal'
                ]
            } as CSSProperties,
            cover: {
                margin: '0 auto',
                height: '842px',
                width: '595px',
                textAlign
            } as CSSProperties,
            image: { maxWidth: '595px', maxHeight: '842px' } as CSSProperties,
            page: { width: '595px', margin: 'auto' } as CSSProperties
        }

        return settings
            ? {
                  docx: defaultStyle,
                  html: {
                      ...defaultStyle,
                      ...{
                          cover: { ...defaultStyle.cover, ...{ height: 'auto' } },
                          p: { ...defaultStyle.p, ...{ fontSize: `${settings.fontSize}px` } }
                      }
                  },
                  pdf: {
                      ...defaultStyle,
                      ...{
                          h1: {
                              ...defaultStyle.h1,
                              ...{ fontFamily: 'arial', fontSize: '16pt' }
                          },
                          h2: {
                              ...defaultStyle.h2,
                              ...{ fontFamily: 'arial', fontSize: '14pt' }
                          },
                          h3: {
                              ...defaultStyle.h3,
                              ...{ fontFamily: 'arial', fontSize: '13pt' }
                          },
                          p: {
                              ...defaultStyle.p,
                              ...{
                                  fontFamily: 'arial',
                                  fontSize: '10pt',
                                  letterSpacing: '0.01px',
                                  lineHeight: 'auto'
                              }
                          }
                      }
                  }
              }[settings.mode]
            : null
    }, [settings])

    useEffect(() => {
        if (!isGenerating || !settings || !exportTemplateRef.current) return

        switch (settings.mode) {
            case 'pdf':
                generatePDF().then(() => {
                    setIsGenerating(false)
                })
                break
            case 'html':
                generateHTML().then(() => {
                    setIsGenerating(false)
                })
                break
            case 'docx':
                generateDocx().then(() => {
                    setIsGenerating(false)
                })
                break
        }
    }, [isGenerating, settings?.mode, exportTemplateRef.current])

    useEffect(() => {
        work.parts.fetch().then((parts) => setParts(parts))
        work.chapters.fetch().then((chapters) => setChapters(chapters))
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

    return (
        <Box className='h-full w-full'>
            {exportTemplateRef.current?.innerHTML ? (
                <ExportAsForm
                    work={work}
                    generateExport={generateExport}
                    isGenerating={isGenerating}
                />
            ) : null}
            <Box className='h-0 w-0 overflow-hidden'>
                <div ref={exportTemplateRef}>
                    <div style={getStyles()?.cover}>
                        {work.image ? (
                            <Image path={work.image} style={getStyles()?.image} />
                        ) : (
                            <>
                                <h1 style={getStyles()?.h1}>{work.title}</h1>
                                {settings?.author ? (
                                    <h3 style={getStyles().h3}>{settings?.author}</h3>
                                ) : null}
                            </>
                        )}
                    </div>
                    <div style={getStyles()?.page}>
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
            </Box>
        </Box>
    )
}

export default ExportAsBox
