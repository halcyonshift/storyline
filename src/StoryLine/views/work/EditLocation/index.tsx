import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useRouteLoaderData } from 'react-router-dom'
import { LocationModel, WorkModel } from '@sl/db/models'

import Form from './form'

const EditLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const work = useRouteLoaderData('work') as WorkModel

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {location.displayName}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <Form work={work} location={location} />
            </Box>
        </Box>
    )
}

export default EditLocationView
