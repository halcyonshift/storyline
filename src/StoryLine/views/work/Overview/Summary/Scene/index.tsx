import { Fragment } from 'react'
import { Typography } from '@mui/material'
import { htmlParse } from '@sl/utils'
import { SceneSummaryProps } from './types'

const SceneSummary = ({ scenes }: SceneSummaryProps) => (
    <>
        {scenes.map((scene) => (
            <Fragment key={scene.id}>
                <Typography variant='h6'>{scene.displayTitle}</Typography>
                {scene.description ? htmlParse(scene.description) : null}
                {scene.excerpts ? <Typography>{scene.excerpts}</Typography> : null}
            </Fragment>
        ))}
    </>
)

export default SceneSummary
