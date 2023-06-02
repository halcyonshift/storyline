import { useState, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { IMPORTEXPORT_ICONS } from '@sl/constants/icons'
import ExportForm from '@sl/forms/Work/Export'
import { WorkModel } from '@sl/db/models'
import { ExportDataType } from '@sl/forms/Work/Export/types'
import parse from './parse'

const EPubBox = ({ work }: { work: WorkModel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useState<ExportDataType>(undefined)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const generateExport = async (values: ExportDataType) => {
        setSettings(values)
        setIsGenerating(true)
    }

    const createEPub = async () => {
        const parts = await work.parts.fetch()

        let part = parts[0]

        if (parts.length > 1) {
            part = parts.find((part) => part.id === settings.part)
        }

        const chapters = await part.chapters.fetch()
        const scenes = await work.scenes.fetch()

        return await api.exportEpub(
            work.title,
            {
                title: work.title,
                author: settings.author || undefined,
                description: work.summary || undefined,
                cover: work.image ? `file://${work.image}` : undefined,
                lang: work.language
            },
            chapters.map((chapter) => ({
                title: settings?.chapterTitle
                    ? settings.chapterTitle
                          .replace('{{number}}', chapter.order.toString())
                          .replace('{{title}}', chapter.displayTitle)
                    : undefined,
                content: scenes
                    .filter((scene) => scene.section.id === chapter.id)
                    .map((scene) => parse(scene.body, settings))
                    .join(settings.sceneSeparator)
            }))
        )
    }

    useEffect(() => {
        if (!isGenerating) return
        void createEPub().then(() => setIsGenerating(false))
    }, [isGenerating])

    return (
        <Box className='grid h-full place-items-center'>
            <Button onClick={() => setOpen(true)}>
                <Box className='text-center'>
                    <Typography variant='h1' color='secondary'>
                        {IMPORTEXPORT_ICONS.epub}
                    </Typography>
                    <Typography variant='h6' color='secondary' className='lowercase'>
                        .epub
                    </Typography>
                </Box>
            </Button>
            <ExportForm
                mode='epub'
                open={open}
                setOpen={setOpen}
                work={work}
                generateExport={generateExport}
                isGenerating={isGenerating}
                showFormatting={false}
            />
        </Box>
    )
}

export default EPubBox
