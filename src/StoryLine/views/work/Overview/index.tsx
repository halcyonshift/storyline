import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DateTime, Interval } from 'luxon'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { SectionModel } from '@sl/db/models'
import { DateObject, ViewOptionType } from './types'

const OverviewView = () => {
    const [view, setView] = useState<ViewOptionType>('summary')
    const { setShowTabs } = useTabs()

    useEffect(() => {
        setShowTabs(true)
    }, [])
    /*
    useEffect(() => {
        Promise.all(
            [].concat(
                ...[
                    sections
                        .filter((section) => !section.isVersion)
                        .map(async (section) => {
                            await section.getSortDate()
                            return section
                        })
                ]
            )
        ).then((sections) => {

            const dates = sections
                .filter((section) => section.sortDate > 0)
                .map((section) => section.sortDate)

            if (!dates.length) return

            Math.min(...dates)
            Math.max(...dates)

            const partsByDate = sections
                .filter((section) => section.isPart)
                .sort((a, b) => a.sortDate - b.sortDate)

            const chaptersByDate = sections
                .filter((section) => section.isChapter)
                .sort((a, b) => a.sortDate - b.sortDate)

            const scenesByDate = sections
                .filter((section) => section.isScene)
                .sort((a, b) => a.sortDate - b.sortDate)

            console.log(intervals)

        })
    }, [sections, characters, notes])
    */
    return <Box className='p-5 border-t-8 border-slate-100'>OverView here</Box>
}

export default OverviewView
