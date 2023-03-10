import Box from '@mui/material/Box'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'

import WorkForm from '@sl/forms/Work/Work'

const EditWorkView = () => {
    const work = useRouteLoaderData('work') as WorkModel

    return (
        <Box className='flex-grow h-0 overflow-auto p-5'>
            <WorkForm
                work={work}
                initialValues={{
                    title: work.title,
                    author: work.author,
                    summary: work.summary,
                    language: 'en-gb',
                    wordGoal: work.wordGoal,
                    deadlineAt: work.deadlineAt
                }}
            />
        </Box>
    )
}

export default EditWorkView
