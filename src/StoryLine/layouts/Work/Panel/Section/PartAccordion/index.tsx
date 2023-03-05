import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import Accordion from '@sl/components/Accordion'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import ChapterAccordion from '../ChapterAccordion'
import { PartAccordionProps } from '../types'

const PartAccordion = ({ parts, chapters, scenes, loadTab }: PartAccordionProps) => (
    <>
        {parts.map((part) => (
            <Accordion
                key={part.id}
                title={
                    <Box className='flex flex-row flex-grow justify-between'>
                        <Typography variant='body1'>{part.displayTitle}</Typography>
                        <Stack spacing={1} direction='row'>
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.section.addChapter'
                                link={`section/${part.id}/add`}
                                icon={SECTION_ICONS.addChapter}
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
                                link={`section/${part.id}/delete`}
                                icon={GLOBAL_ICONS.delete}
                            />
                        </Stack>
                    </Box>
                }
                className='bg-indigo-400 dark:bg-indigo-800 text-white p-1 border-b'>
                <ChapterAccordion
                    loadTab={loadTab}
                    chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                    scenes={scenes}
                />
            </Accordion>
        ))}
    </>
)

export default PartAccordion
