import { useRef, useState, useMemo, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import jsPDF from 'jspdf'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'
import FullWork from '../../FullWork'
import { parse } from '../../utils/parse'
import getStyles from '../../utils/styles'

const PDFBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const ref = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const styles = useMemo(() => {
        const defaults = getStyles(settings)
        return {
            ...defaults,
            ...{
                h1: { ...defaults.h1, ...{ fontFamily: 'arial', fontSize: '16pt' } },
                h2: { ...defaults.h1, ...{ fontFamily: 'arial', fontSize: '14pt' } },
                h3: { ...defaults.h1, ...{ fontFamily: 'arial', fontSize: '13pt' } }
            }
        }
    }, [settings])

    const generateExport = async (values: ExportDataType) => {
        setSettings(values)
        setIsGenerating(true)
    }

    const createPDF = async () => {
        const pdf = new jsPDF({
            unit: 'pt',
            orientation: 'p',
            putOnlyUsedFonts: true,
            compress: true
        })

        pdf.advancedAPI(async (pdf) => {
            await pdf.html(ref.current.innerHTML, {
                autoPaging: 'text',
                margin: 56.7,
                windowWidth: 595,
                width: 481.6
            })

            setIsGenerating(false)
            pdf.save(work.title)
        })
    }

    useEffect(() => {
        if (!isGenerating || !ref.current.innerHTML) return
        void createPDF()
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
