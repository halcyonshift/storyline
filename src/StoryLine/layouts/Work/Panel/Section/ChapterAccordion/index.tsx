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
                className='p-1 '
                title={
                    <Box className='flex flex-row flex-grow justify-between'>
                        <Typography variant='body1'>{chapter.displayTitle}</Typography>
                        <Stack spacing={1} direction='row'>
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.section.addScene'
                                link={`section/${chapter.id}/add`}
                                icon={SECTION_ICONS.addScene}
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
                                link={`section/${chapter.id}/delete`}
                                icon={GLOBAL_ICONS.delete}
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
