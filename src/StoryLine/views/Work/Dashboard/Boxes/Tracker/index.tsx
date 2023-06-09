import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel, WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import { htmlParse } from '@sl/utils/html'
import ChapterList from './ChapterList'
import PartList from './PartList'
import SceneList from './SceneList'

const TrackerBox = () => {
    const [totalWords, setTotalWords] = useState<number>(0)
    const [totalPercentage, setTotalPercentage] = useState<string>('')
    const [parts, setParts] = useState<SectionModel[]>([])
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const work = useRouteLoaderData('work') as WorkModel
    const settings = useSettings()
    const { t } = useTranslation()

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
        <Box className='p-3 h-full flex flex-col'>
            <Box className='pb-2'>
                <Typography variant='h6' textAlign='left'>
                    {totalWords.toLocaleString(settings.language)}
                    {work.wordGoal
                        ? ` / ${work.wordGoal?.toLocaleString(
                              settings.language
                          )} (${totalPercentage}%)`
                        : ''}
                </Typography>
                {work.deadlineAt && work.timeLeft ? (
                    <Typography variant='body2'>
                        {work.deadlineAt && work.timeLeft
                            ? htmlParse(
                                  t('view.work.dashboard.tracker.deadline.days', {
                                      timeLeft: work.timeLeft
                                  })
                              )
                            : null}
                        {work.wordGoal
                            ? htmlParse(
                                  t('view.work.dashboard.tracker.deadline.words', {
                                      wordsPerDay: work.wordsPerDay(totalWords)
                                  })
                              )
                            : null}
                    </Typography>
                ) : null}
            </Box>
            <Box className='flex-grow overflow-auto scrollbar-hidden'>
                {(() => {
                    if (parts.length > 1) {
                        return <PartList parts={parts} chapters={chapters} scenes={scenes} />
                    } else if (chapters.length > 1) {
                        return <ChapterList chapters={chapters} scenes={scenes} />
                    } else {
                        return <SceneList scenes={scenes} />
                    }
                })()}
            </Box>
        </Box>
    )
}
export default TrackerBox
