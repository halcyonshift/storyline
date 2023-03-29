import { useEffect, useRef, useState } from 'react'
import jsPDF from 'jspdf'
import { Description, PictureAsPdf, Html } from '@mui/icons-material'
import { Box, IconButton, Button } from '@mui/material'
import { ExportModeType, ExportModeTypes } from './types'
import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel, WorkModel } from '@sl/db/models'
import { htmlParse } from '@sl/utils'

const ExportTemplate = ({ work }: { work: WorkModel }) => {
    const [scenes, setScenes] = useState<SectionModel[]>([])

    useEffect(() => {
        work.scenes.fetch().then((scenes) => setScenes(scenes))
    }, [])

    return (
        <>
            <h1 style={{ fontFamily: 'Arial', textAlign: 'center', fontSize: '16pt' }}>
                {work.title}
            </h1>
            {work.author ? (
                <h3 style={{ fontFamily: 'Arial', textAlign: 'center', fontSize: '13pt' }}>
                    {work.author}
                </h3>
            ) : null}
            <hr style={{ marginTop: '10pt' }} />
            {scenes.map((scene) => (
                <div
                    style={{ fontFamily: 'Arial', fontSize: '10pt', letterSpacing: '0.01px' }}
                    key={scene.id}>
                    {htmlParse(scene.body)}
                </div>
            ))}
        </>
    )
}

const ExportAsBox = () => {
    const [mode, setMode] = useState<ExportModeType>('pdf')
    const [show, setShow] = useState<boolean>(false)
    const exportTemplateRef = useRef<HTMLDivElement>(null)
    const work = useRouteLoaderData('work') as WorkModel
    const exportModes: ExportModeTypes[] = [
        {
            mode: 'pdf',
            icon: <PictureAsPdf fontSize='large' />
        },
        {
            mode: 'doc',
            icon: <Description fontSize='large' />
        },
        {
            mode: 'html',
            icon: <Html fontSize='large' />
        }
    ]

    const generateExport = async (): Promise<void> => {
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
        if (!show) return
        generateExport().then(() => setShow(false))
    }, [show])

    return (
        <Box className='flex items-center justify-center px-5 h-full'>
            <Box>
                <Box>
                    {exportModes.map((exportMode) => (
                        <IconButton
                            key={exportMode.mode}
                            color={mode === exportMode.mode ? 'info' : 'default'}
                            onClick={() => setMode(exportMode.mode)}>
                            {exportMode.icon}
                        </IconButton>
                    ))}
                </Box>
                <Button
                    onClick={async () => {
                        setShow(true)
                    }}>
                    Generate
                </Button>
                {show ? (
                    <Box className='h-0 w-0 overflow-hidden'>
                        <div ref={exportTemplateRef}>
                            <ExportTemplate work={work} />
                        </div>
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

export default ExportAsBox
