import { Fragment } from 'react'
import { Box, Typography } from '@mui/material'
import { htmlParse } from '@sl/utils'
import { PartSummaryProps } from './types'
import ChapterSummary from '../Chapter'

const PartSummary = ({ parts, chapters, scenes }: PartSummaryProps) => (
    <>
        {parts.map((part) => (
            <Fragment key={part.id}>
                <Box>
                    <Typography variant='h6'>{part.displayTitle}</Typography>
                    {part.description ? htmlParse(part.description) : null}
                </Box>
                <ChapterSummary
                    chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                    scenes={scenes}
                />
            </Fragment>
        ))}
    </>
)

export default PartSummary
