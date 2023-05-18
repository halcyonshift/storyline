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
                    <Typography variant='body1'>{chapter.displayDate}</Typography>
                    <Typography variant='h5'>{chapter.displayTitle}</Typography>
                    {chapter.description ? htmlParse(chapter.description) : null}
                </Box>
                <Box className='mx-5 my-3 px-5 py-3 border-l-2'>
                    <SceneSummary
                        scenes={scenes.filter((scene) => scene.section.id === chapter.id)}
                    />
                </Box>
            </Fragment>
        ))}
    </>
)

export default ChapterSummary
