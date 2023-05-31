import { useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Link from '@sl/components/Link'
import useMessenger from '@sl/layouts/useMessenger'
import useSettings from '@sl/theme/useSettings'
import importBibisco from './importBibisco'

const BibiscoBox = () => {
    const [importing, setImporting] = useState<boolean>(false)
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { appFontSize } = useSettings()
    const { t } = useTranslation()

    const handleImport = async () => {
        setImporting(true)
        const workId = await importBibisco(database)
        setImporting(false)

        if (workId) {
            navigate(`/work/${workId}`)
        } else {
            messenger.error(t('view.storyline.import.bibisco.error'))
        }
    }

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>
                <Link href='https://bibisco.com/' color='inherit'>
                    {t('view.storyline.import.bibisco.title')}
                </Link>
            </Typography>
            <Typography variant='body1'>{t('view.storyline.import.bibisco.text')}</Typography>
            {importing ? (
                <CircularProgress size={appFontSize * 2} />
            ) : (
                <Button variant='contained' onClick={handleImport}>
                    {t('view.storyline.import.button')}
                </Button>
            )}
        </Box>
    )
}

export default BibiscoBox
