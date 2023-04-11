import { useState, useEffect } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { flatten } from 'lodash'
import { htmlParse } from '@sl/utils'
import { SceneSummaryProps } from './types'
import { SectionModel } from '@sl/db/models'

const TagList = ({ scene }: { scene: SectionModel }) => {
    const [tags, setTags] = useState<string>('')

    useEffect(() => {
        Promise.all([
            scene.taggedCharacters(),
            scene.taggedLocations(),
            scene.taggedItems(),
            scene.taggedNotes()
        ]).then((tags) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const _tags = flatten(tags) as any
            setTags(
                _tags
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((tag: any) =>
                        tag.text.length && tag.text.join('') !== tag.record.displayName
                            ? `${tag.record.displayName} (${tag.text.join(', ')})`
                            : tag.record.displayName
                    )
                    .join(', ')
            )
        })
    }, [])

    return <Typography variant='body1'>{tags}</Typography>
}

const SceneSummary = ({ scenes }: SceneSummaryProps) => (
    <Stack spacing={2}>
        {scenes.map((scene) => (
            <Box key={scene.id}>
                <Typography variant='body2'>{scene.displayDateTime}</Typography>
                <Typography variant='h6'>{scene.displayTitle}</Typography>
                <TagList scene={scene} />
                {scene.description ? htmlParse(scene.description) : null}
                <Box className='italic'>{scene.excerpts ? scene.excerpts : null}</Box>
            </Box>
        ))}
    </Stack>
)

export default SceneSummary
