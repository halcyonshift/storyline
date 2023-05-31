import { useState, useEffect } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { flatten } from 'lodash'
import { SectionModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { htmlParse } from '@sl/utils/html'
import { SceneSummaryProps } from './types'

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

const SceneSummary = ({ scenes }: SceneSummaryProps) => {
    const { loadTab } = useTabs()

    return (
        <Stack spacing={2}>
            {scenes.map((scene) => (
                <Box key={scene.id}>
                    <Typography variant='body2'>{scene.displayDateTime}</Typography>
                    <Typography
                        variant='h6'
                        onClick={() => loadTab({ id: scene.id, mode: 'section' })}>
                        {scene.displayTitle}
                    </Typography>
                    <TagList scene={scene} />
                    {scene.description ? htmlParse(scene.description) : null}
                    <Box className='italic'>{scene.excerpts ? scene.excerpts : null}</Box>
                </Box>
            ))}
        </Stack>
    )
}

export default SceneSummary
