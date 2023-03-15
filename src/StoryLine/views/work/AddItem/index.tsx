import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

import ItemForm from '@sl/forms/Work/Item'

const AddItemView = () => {
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
                    {t('view.work.addItem.title')}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <ItemForm work={work} />
            </Box>
        </Box>
    )
}

export default AddItemView
