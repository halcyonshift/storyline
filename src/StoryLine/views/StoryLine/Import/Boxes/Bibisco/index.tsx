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
        <Box className='flex flex-grow flex-col p-5'>
            <Typography className='text-center text-[#004000]' variant='h6'>
                <Link href='https://bibisco.com/' color='inherit'>
                    {t('view.storyline.import.bibisco.title')}
                </Link>
            </Typography>
            <Typography className='text-center' variant='body2'>
                <Link href='https://bibisco.com/' color='inherit'>
                    bibisco.com
                </Link>
            </Typography>
            <Box className='flex-grow p-5'>
                <Typography variant='body1' className='text-center'>
                    {t('view.storyline.import.bibisco.text')}
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

export default BibiscoBox
