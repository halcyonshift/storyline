import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { colors } from '@sl/theme/utils'
import ChapterAccordion from '../ChapterAccordion'
import { PartAccordionProps } from '../types'

const PartAccordion = ({ parts, chapters, scenes, loadTab }: PartAccordionProps) => (
    <>
        {parts.map((part) => (
            <Accordion key={part.id} disableGutters square elevation={0}>
                <AccordionSummary
                    sx={{ backgroundColor: colors.indigo['400'] }}
                    expandIcon={<ExpandMoreIcon htmlColor={colors.white} />}
                    aria-controls={`${part.id}-chapters`}
                    id={`${part.id}-header`}>
                    <Typography variant='body1' className='py-2 text-white'>
                        {part.displayTitle}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
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
