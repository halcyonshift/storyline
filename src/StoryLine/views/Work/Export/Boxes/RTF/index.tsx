import { useRef, useState, useMemo, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'
import { parse } from '../../utils/parse'
import getStyles from '../../utils/styles'
import FullWork from '../../FullWork'

const RTFBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const ref = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const styles = useMemo(() => {
        const defaults = getStyles(settings)
        return {
            ...defaults,
            ...{
                h1: {
                    ...defaults.h1,
                    ...{
                        fontSize: '60px'
                    }
                },
                h2: {
                    ...defaults.h2,
                    ...{
                        fontSize: '50px'
                    }
                },
                h3: {
                    ...defaults.h3,
                    ...{
                        fontSize: '40px'
                    }
                }
            }
        }
    }, [settings])

    const generateExport = async (values: ExportDataType) => {
        values.fontSize = values.fontSize * 2
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
