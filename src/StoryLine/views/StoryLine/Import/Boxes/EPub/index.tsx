import { useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useMessenger from '@sl/layouts/useMessenger'
import useSettings from '@sl/theme/useSettings'
import importEPub from './importEPub'

const EPubBox = () => {
    const [importing, setImporting] = useState<boolean>(false)
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { appFontSize } = useSettings()
    const { t } = useTranslation()

    const handleImport = async () => {
        setImporting(true)
        const workId = await importEPub(database)
        setImporting(false)

        if (workId) {
            navigate(`/work/${workId}`)
        } else {
            messenger.error(t('view.storyline.import.epub.error'))
        }
    }

    return (
        <Box className='flex flex-grow flex-col p-5'>
            <Typography className='text-center' variant='h6'>
                {t('view.storyline.import.epub.title')}
            </Typography>
            <Box className='flex-grow p-5'>
                <Typography className='text-center' variant='body1'>
                    {t('view.storyline.import.epub.text')}
                </Typography>
            </Box>
            {importing ? (
                <Box className='text-center'>
                    <CircularProgress size={appFontSize * 2} />
                </Box>
            ) : (
                <Button variant='contained' onClick={handleImport}>
                    {t('view.storyline.import.button')}
                </Button>
            )}
        </Box>
    )
}

export default EPubBox
