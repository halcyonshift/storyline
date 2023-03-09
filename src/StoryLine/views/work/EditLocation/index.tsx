import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useRouteLoaderData } from 'react-router-dom'
import { LocationModel } from '@sl/db/models'

import LocationForm from '@sl/forms/Work/Location'

const EditLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {location.displayName}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <LocationForm
                    location={location}
                    initialValues={{
                        name: location.name,
                        body: location.body,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        url: location.url,
                        image: location.image
                    }}
                />
            </Box>
        </Box>
    )
}

export default EditLocationView
