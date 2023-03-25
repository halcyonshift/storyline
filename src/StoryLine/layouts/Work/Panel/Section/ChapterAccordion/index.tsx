import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import Accordion from '@sl/components/Accordion'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { useTranslation } from 'react-i18next'
import SceneList from '../SceneList'
import { ChapterAccordionProps } from '../types'

const ChapterAccordion = ({ chapters, scenes }: ChapterAccordionProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <>
            {chapters.map((chapter) => (
                <Accordion
                    key={chapter.id}
                    className='p-1 border-b'
                    title={
                        <Box className='flex flex-grow'>
                            <Typography
                                variant='body1'
                                className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                            overflow-hidden self-center'>
                                {chapter.displayTitle}
                            </Typography>
                            <Stack spacing={0} direction='row'>
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.addScene'
                                    icon={SECTION_ICONS.addScene}
                                    onClick={() => {
                                        chapter.addScene()
                                    }}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.edit'
                                    link={`section/${chapter.id}/edit`}
                                    icon={GLOBAL_ICONS.edit}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.delete'
                                    icon={GLOBAL_ICONS.delete}
                                    confirm={t('layout.work.panel.section.deleteConfirm', {
                                        name: chapter.displayTitle
                                    })}
                                    onClick={async () => {
                                        await chapter.delete()
                                        navigate(`/works/${chapter.work.id}`)
                                    }}
                                />
                            </Stack>
                        </Box>
                    }>
                    <SceneList scenes={scenes.filter((scene) => scene.section.id === chapter.id)} />
                </Accordion>
            ))}
        </>
    )
}

export default ChapterAccordion
