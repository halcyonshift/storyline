import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { useRouteLoaderData } from 'react-router-dom'
import { SprintModel, WorkModel } from '@sl/db/models'

const Result = ({ sprint }: { sprint: SprintModel }) => {
    const [words, setWords] = useState<number>(0)

    useEffect(() => {
        sprint.wordCount().then((words) => setWords(words))
    }, [])

    return (
        <Box className='flex w-full justify-around'>
            <Typography>
                {DateTime.fromJSDate(sprint.startAt).toLocaleString(DateTime.DATE_FULL)}
            </Typography>
            <Typography>
                {DateTime.fromJSDate(sprint.startAt).toLocaleString(DateTime.TIME_SIMPLE)} -
                {DateTime.fromJSDate(sprint.endAt).toLocaleString(DateTime.TIME_SIMPLE)}
            </Typography>
            <Typography>{sprint.wordGoal ? `${words}/${sprint.wordGoal}` : words}</Typography>
        </Box>
    )
}

const SprintResults = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const [sprints, setSprints] = useState<SprintModel[]>([])

    useEffect(() => {
        work.sprint.fetch().then((sprints) => setSprints(sprints))
    }, [])

    return (
        <Box className='relative h-full p-3 w-auto grid place-items-center'>
            {sprints.map((sprint) => (
                <Result key={sprint.id} sprint={sprint}></Result>
            ))}
        </Box>
    )
}

export default SprintResults
