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
                    <Typography variant='body1'>{part.displayDate}</Typography>
                    <Typography variant='h4'>{part.displayTitle}</Typography>
                    {part.description ? htmlParse(part.description) : null}
                </Box>
                <Box className='mx-5 my-3 px-5 py-3 border-l-2'>
                    <ChapterSummary
                        chapters={chapters.filter((chapter) => chapter.section.id === part.id)}
                        scenes={scenes}
                    />
                </Box>
            </Fragment>
        ))}
    </>
)

export default PartSummary
