import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { GLOBAL_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import Accordion from '@sl/components/Accordion'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import SceneList from '../SceneList'
import { ChapterAccordionProps } from '../types'

const ChapterAccordion = ({ chapters, scenes, loadTab }: ChapterAccordionProps) => (
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
                                onClick={() => chapter.addScene()}
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
                                onClick={() => chapter.delete()}
                            />
                        </Stack>
                    </Box>
                }>
                <SceneList
                    loadTab={loadTab}
                    scenes={scenes.filter((scene) => scene.section.id === chapter.id)}
                />
            </Accordion>
        ))}
    </>
)

export default ChapterAccordion
