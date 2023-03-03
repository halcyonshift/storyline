import { useEffect, useState } from 'react'
import ArticleIcon from '@mui/icons-material/Article'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import QueueIcon from '@mui/icons-material/Queue'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { SectionModel } from '../../../../../../db/models'
import { SectionPanelProps } from '../types'

const SectionPanel = ({ sections, loadTab }: SectionPanelProps) => {
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])

    const { t } = useTranslation()

    useEffect(() => {
        setParts(sections.filter((section) => section.isPart))
        setChapters(sections.filter((section) => section.isChapter))
        setScenes(sections.filter((section) => section.isScene))
    }, [sections])

    return (
        <Box className='flex-grow flex flex-col'>
            <Stack direction='row'>
                <Tooltip title={t('layout.work.panel.section.addPart')}>
                    <IconButton color='inherit' aria-label={t('layout.work.panel.section.addPart')}>
                        <QueueIcon />
                    </IconButton>
                </Tooltip>
                {parts.length === 1 ? (
                    <Tooltip title={t('layout.work.panel.section.addChapter')}>
                        <IconButton
                            color='inherit'
                            aria-label={t('layout.work.panel.section.addChapter')}>
                            <LibraryBooksIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
                {chapters.length === 1 ? (
                    <Tooltip title={t('layout.work.panel.section.addScene')}>
                        <IconButton
                            color='inherit'
                            aria-label={t('layout.work.panel.section.addScene')}>
                            <ArticleIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </Stack>
            <Divider />
            <Box className='flex-grow overflow-auto'>
                {parts.map((part) => (
                    <Box key={part.id}>
                        {parts.length > 1 ? (
                            <Typography variant='h5'>{part.displayTitle}</Typography>
                        ) : null}
                        {chapters
                            .filter((chapter) => chapter.section.id === part.id)
                            .map((chapter) => (
                                <Box key={chapter.id}>
                                    {chapters.length > 1 ? (
                                        <Typography variant='h6'>{chapter.displayTitle}</Typography>
                                    ) : null}
                                    {scenes
                                        .filter((scene) => scene.section.id === chapter.id)
                                        .map((scene) => (
                                            <Typography
                                                variant='body1'
                                                key={scene.id}
                                                onClick={() =>
                                                    loadTab({
                                                        id: scene.id,
                                                        label: scene.displayTitle,
                                                        link: `section/${scene.id}`
                                                    })
                                                }>
                                                {scene.displayTitle}
                                            </Typography>
                                        ))}
                                </Box>
                            ))}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default SectionPanel
