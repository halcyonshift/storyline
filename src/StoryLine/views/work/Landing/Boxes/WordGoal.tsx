import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'

const WordGoalBox = () => {
    const [totalWords, setTotalWords] = useState<number>(0)
    const [totalPercentage, setTotalPercentage] = useState<string>('')
    const settings = useSettings()
    const work = useRouteLoaderData('work') as WorkModel

    useEffect(() => {
        work.wordCount().then((count) => {
            setTotalWords(count)
            if (work.wordGoal) {
                setTotalPercentage(((100 / work.wordGoal) * count).toFixed(1))
            }
        })
    }, [])

    return (
        <Box className='p-3'>
            <Typography variant='h6' textAlign='right'>
                {totalWords.toLocaleString(settings.language)}
                {work.wordGoal
                    ? ` /${work.wordGoal.toLocaleString(settings.language)} (${totalPercentage}%)`
                    : ''}
            </Typography>
        </Box>
    )
}
export default WordGoalBox
