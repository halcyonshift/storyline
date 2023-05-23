import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useMessenger from '@sl/layouts/useMessenger'
import importEPub from './importEPub'

const ePubBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>{t('view.storyline.importWork.epub.title')}</Typography>
            <Button
                variant='contained'
                onClick={async () => {
                    const workId = await importEPub(database)

                    if (workId) {
                        navigate(`/work/${workId}`)
                    } else {
                        messenger.error(t('view.storyline.importWork.epub.error'))
                    }
                }}>
                {t('view.storyline.importWork.button')}
            </Button>
        </Box>
    )
}

export default ePubBox
