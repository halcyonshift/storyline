import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel, WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'

import ChapterList from './ChapterList'
import PartList from './PartList'
import SceneList from './SceneList'

const TrackerBox = () => {
    const [totalWords, setTotalWords] = useState<number>(0)
    const [totalPercentage, setTotalPercentage] = useState<string>('')
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const settings = useSettings()
    const work = useRouteLoaderData('work') as WorkModel

    useEffect(() => {
        work.wordCount().then((count) => {
            setTotalWords(count)
            if (work.wordGoal) {
                setTotalPercentage(((100 / work.wordGoal) * count).toFixed(1))
            }
        })

        work.sections.fetch().then(async (sections) => {
            for await (const section of sections) {
                section.getWordCount()
            }
            setParts(sections.filter((section) => section.isPart))
            setChapters(sections.filter((section) => section.isChapter))
            setScenes(sections.filter((section) => section.isScene))
        })
    }, [])

    return (
        <Box className='p-3'>
            <Typography variant='h6' textAlign='right' className='pb-2'>
                {totalWords.toLocaleString(settings.language)}
                {work.wordGoal
                    ? ` /${work.wordGoal.toLocaleString(settings.language)} (${totalPercentage}%)`
                    : ''}
            </Typography>
            {parts.length > 1 ? (
                <PartList parts={parts} chapters={chapters} scenes={scenes} />
            ) : chapters.length > 1 ? (
                <ChapterList chapters={chapters} scenes={scenes} />
            ) : (
                <SceneList scenes={scenes} />
            )}
        </Box>
    )
}
export default TrackerBox
