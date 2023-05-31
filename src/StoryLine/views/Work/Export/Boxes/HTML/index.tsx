import { useRef, useState, useMemo, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'
import FullWork from '../../FullWork'
import { parse } from '../../utils/parse'
import getStyles from '../../utils/styles'

const HTMLBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const ref = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const styles = useMemo(() => getStyles(settings), [settings])

    const generateExport = async (values: ExportDataType) => {
        setSettings(values)
        setIsGenerating(true)
    }

    useEffect(() => {
        if (!isGenerating || !ref.current.innerHTML) return
        api.exportHTML(
            work.title,
            `<!DOCTYPE html><html>` +
                `<head><title>${work.title}</title></head>` +
                `<body>${ref.current.innerHTML}</body>` +
                `</html>`
        ).then(() => {
            setIsGenerating(false)
        })
    }, [isGenerating, ref.current])

    return (
        <Box className='grid h-full place-items-center'>
            <Button onClick={() => setOpen(true)}>
                <Box className='text-center'>
                    <Typography variant='h1' color='secondary'>
                        {IMPORTEXPORT_ICONS.html}
                    </Typography>
                    <Typography variant='h6' color='secondary' className='lowercase'>
                        .html
                    </Typography>
                </Box>
            </Button>
            <ExportForm
                mode='html'
                open={open}
                setOpen={setOpen}
                work={work}
                generateExport={generateExport}
                isGenerating={isGenerating}
                showFormatting={true}
            />
            {open ? (
                <FullWork parse={parse} forwardRef={ref} settings={settings} styles={styles} />
            ) : null}
        </Box>
    )
}

export default HTMLBox
