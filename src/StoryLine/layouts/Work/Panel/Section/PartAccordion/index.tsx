import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import Accordion from '@sl/components/Accordion'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import { useSettings } from '@sl/theme'
import ChapterAccordion from '../ChapterAccordion'
import { PartAccordionProps } from '../types'

const PartAccordion = ({ parts, chapters, scenes }: PartAccordionProps) => {
    const settings = useSettings()
    const { t } = useTranslation()

    return (
        <>
            {parts.map((part) => (
                <Accordion
                    key={part.id}
                    title={
                        <Box className='flex flex-grow'>
                            <Typography
                                variant='body1'
                                className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                            overflow-hidden self-center'>
                                {part.displayTitle}
                            </Typography>
                            <Stack direction='row'>
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.addChapter'
                                    icon={SECTION_ICONS.addChapter}
                                    onClick={() => part.addChapter()}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.edit'
                                    link={`section/${part.id}/edit`}
                                    icon={GLOBAL_ICONS.edit}
                                />
                                <TooltipIconButton
                                    size='small'
                                    text='layout.work.panel.section.delete'
                                    icon={GLOBAL_ICONS.delete}
                                    confirm={t('layout.work.panel.section.deleteConfirm', {
                                        name: part.displayTitle
                                    })}
                                    onClick={() => part.delete()}
                                />
                            </Stack>
                        </Box>
                    }
                    sx={{ backgroundColor: settings.getHex(400) }}
                    className='text-white p-1 border-b'>
                    <ChapterAccordion
                        chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                        scenes={scenes}
                    />
                </Accordion>
            ))}
        </>
    )
}

export default PartAccordion
