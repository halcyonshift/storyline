import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { GLOBAL_ICONS } from '../../../../../../../icons'

import SceneList from '../SceneList'
import { ChapterAccordionProps } from '../types'

const ChapterAccordion = ({ chapters, scenes, loadTab }: ChapterAccordionProps) => (
    <>
        {chapters.map((chapter) => (
            <Accordion key={chapter.id} disableGutters square elevation={0}>
                <AccordionSummary
                    sx={{ minHeight: 'auto', backgroundColor: '#EEF2FF' }}
                    expandIcon={GLOBAL_ICONS.expand}
                    aria-controls={`${chapter.id}-scenes`}
                    id={`${chapter.id}-header`}>
                    <Typography className='py-2'>{chapter.displayTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                    <SceneList
                        loadTab={loadTab}
                        scenes={scenes.filter((scene) => scene.section.id === chapter.id)}
                    />
                </AccordionDetails>
            </Accordion>
        ))}
    </>
)

export default ChapterAccordion
