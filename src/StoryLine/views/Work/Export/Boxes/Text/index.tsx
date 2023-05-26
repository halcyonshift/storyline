import { useRef, useState, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'
import { parse } from '../../utils/parse'
import FullWork from '../../FullWork'

const TextBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const ref = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const generateExport = async (values: ExportDataType) => {
        setSettings(values)
        setIsGenerating(true)
    }

    useEffect(() => {
        if (!isGenerating || !ref.current.innerHTML) return
        api.exportText(work.title, ref.current.innerHTML).then(() => {
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
                        .txt
                    </Typography>
                </Box>
            </Button>
            <ExportForm
                mode='txt'
                open={open}
                setOpen={setOpen}
                work={work}
                generateExport={generateExport}
                isGenerating={isGenerating}
                showFormatting={false}
            />
            {open ? <FullWork parse={parse} forwardRef={ref} settings={settings} /> : null}
        </Box>
    )
}

export default TextBox
