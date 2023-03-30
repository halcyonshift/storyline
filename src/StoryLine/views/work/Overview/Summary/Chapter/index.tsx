import { Box, Typography } from '@mui/material'
import { htmlParse } from '@sl/utils'
import { ChapterSummaryProps } from './types'
import SceneSummary from '../Scene'

const ChapterSummary = ({ chapters, scenes }: ChapterSummaryProps) => (
    <>
        {chapters.map((chapter) => (
            <>
                <Box>
                    <Typography variant='h6'>{chapter.displayTitle}</Typography>
                    {chapter.description ? htmlParse(chapter.description) : null}
                </Box>
                <SceneSummary scenes={scenes.filter((scene) => scene.section.id === chapter.id)} />
            </>
        ))}
    </>
)

export default ChapterSummary
