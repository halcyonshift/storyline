import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { GLOBAL_ICONS } from '../../../../../../../icons'
import ChapterAccordion from '../ChapterAccordion'
import { PartAccordionProps } from '../types'

const PartAccordion = ({ parts, chapters, scenes, loadTab }: PartAccordionProps) => (
    <>
        {parts.map((part) => (
            <Accordion key={part.id}>
                <AccordionSummary
                    expandIcon={GLOBAL_ICONS.expand}
                    aria-controls={`${part.id}-chapters`}
                    id={`${part.id}-header`}>
                    <Typography>{part.displayTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ChapterAccordion
                        loadTab={loadTab}
                        chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                        scenes={scenes}
                    />
                </AccordionDetails>
            </Accordion>
        ))}
    </>
)

export default PartAccordion
