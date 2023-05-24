import { useRef, useState, CSSProperties, useMemo, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import jsPDF from 'jspdf'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'
import { htmlParse } from '@sl/utils'
import FullWork from '../../FullWork'

const PDFBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const ref = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const parse = (html: string) => {
        return htmlParse(html)
    }

    const styles = useMemo(
        () => ({
            h1: { textAlign: 'center', fontFamily: 'arial', fontSize: '16pt' } as CSSProperties,
            h2: {
                textAlign: 'center',
                fontFamily: 'arial',
                fontSize: '14pt'
            } as CSSProperties,
            h3: {
                textAlign: 'center',
                fontFamily: 'arial',
                fontSize: '13pt'
            } as CSSProperties,
            sep: { textAlign: 'center', fontFamily: 'arial' } as CSSProperties,
            p: {
                fontFamily: 'arial',
                fontSize: '10pt',
                letterSpacing: '0.01px',
                lineHeight: 'auto'
            } as CSSProperties,
            cover: {
                margin: '0 auto',
                height: '842px',
                width: '595px',
                textAlign: 'center'
            } as CSSProperties,
            image: { maxWidth: '595px', maxHeight: '842px' } as CSSProperties,
            page: { width: '595px', margin: 'auto' } as CSSProperties
        }),
        [settings]
    )

    const generateExport = async (values: ExportDataType) => {
        setSettings(values)
        setIsGenerating(true)
    }

    const createPDF = async () => {
        const pdf = new jsPDF({
            unit: 'pt',
            putOnlyUsedFonts: true,
            compress: true
        })

        await pdf.html(ref.current.innerHTML, {
            autoPaging: 'text',
            margin: 56.7,
            windowWidth: 595,
            width: 481.6
        })

        pdf.save(work.title)
    }

    useEffect(() => {
        if (!isGenerating || !ref.current.innerHTML) return

        createPDF().then(() => {
            setIsGenerating(false)
        })
    }, [isGenerating, ref.current])

    return (
        <Box className='grid h-full place-items-center'>
            <Button onClick={() => setOpen(true)}>
                <Box className='text-center'>
                    <Typography variant='h1' color='secondary'>
                        {IMPORTEXPORT_ICONS.pdf}
                    </Typography>
                    <Typography variant='h6' color='secondary' className='lowercase'>
                        .pdf
                    </Typography>
                </Box>
            </Button>
            <ExportForm
                mode='pdf'
                open={open}
                setOpen={setOpen}
                work={work}
                generateExport={generateExport}
                isGenerating={isGenerating}
                showFormatting={false}
            />
            {open ? (
                <FullWork parse={parse} forwardRef={ref} settings={settings} styles={styles} />
            ) : null}
        </Box>
    )
}

export default PDFBox
