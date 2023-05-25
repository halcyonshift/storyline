import { useRef, useState, CSSProperties, useMemo, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'

import FullWork from '../../FullWork'

const RTFBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const ref = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const parse = (html: string) => html

    const styles = useMemo(
        () => ({
            h1: { textAlign: 'center', fontFamily: 'arial' } as CSSProperties,
            h2: {
                textAlign: 'center',
                fontFamily: 'arial'
            } as CSSProperties,
            h3: {
                textAlign: 'center',
                fontFamily: 'arial',
                fontSize: '13pt'
            } as CSSProperties,
            sep: { textAlign: 'center', fontFamily: 'arial' } as CSSProperties,
            p: {
                fontFamily: 'arial',
                fontSize: `${settings?.fontSize || 12}px`
            } as CSSProperties,
            cover: {
                margin: '0 auto',
                height: 'auto',
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

    useEffect(() => {
        if (!isGenerating || !ref.current.innerHTML) return
        api.exportRTF(work.title, ref.current.innerHTML).then(() => {
            setIsGenerating(false)
        })
    }, [isGenerating, ref.current])

    return (
        <Box className='grid h-full place-items-center'>
            <Button onClick={() => setOpen(true)}>
                <Box className='text-center'>
                    <Typography variant='h1' color='secondary'>
                        {IMPORTEXPORT_ICONS.txt}
                    </Typography>
                    <Typography variant='h6' color='secondary' className='lowercase'>
                        .rtf
                    </Typography>
                </Box>
            </Button>
            <ExportForm
                mode='rtf'
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

export default RTFBox