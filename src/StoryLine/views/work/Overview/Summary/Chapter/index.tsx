import { Fragment } from 'react'
import { Box, Typography } from '@mui/material'
import { htmlParse } from '@sl/utils'
import { ChapterSummaryProps } from './types'
import SceneSummary from '../Scene'

const ChapterSummary = ({ chapters, scenes }: ChapterSummaryProps) => (
    <>
        {chapters.map((chapter) => (
            <Fragment key={chapter.id}>
                <Box>
                    <Typography variant='h6'>{chapter.displayTitle}</Typography>
                    {chapter.description ? htmlParse(chapter.description) : null}
                </Box>
                <SceneSummary scenes={scenes.filter((scene) => scene.section.id === chapter.id)} />
            </Fragment>
        ))}
    </>
)

export default ChapterSummary
