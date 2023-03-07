import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'

import Form from './form'

const AddLocationView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {t('view.work.addLocation.title')}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <Form work={work} />
            </Box>
        </Box>
    )
}

export default AddLocationView
