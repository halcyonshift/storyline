import Box from '@mui/material/Box'
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
                    <Box className='flex flex-grow'>
                        <Typography
                            variant='body1'
                            className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                        overflow-hidden self-center'>
                            {part.displayTitle}
                        </Typography>
                        <Stack spacing={1} direction='row'>
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
                                onClick={() => part.delete()}
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
