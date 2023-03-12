import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { LocationModel, WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/useTabs'

import LocationForm from '@sl/forms/Work/Location'

const AddLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()
    const tabs = useTabs()

    useEffect(() => {
        tabs.setShowTabs(false)
    }, [])

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {location ? `${location.displayName}: ` : null}
                    {t('view.work.addLocation.title')}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <LocationForm work={work} location={location} />
            </Box>
        </Box>
    )
}

export default AddLocationView
