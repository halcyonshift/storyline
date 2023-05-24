import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Link from '@sl/components/Link'
import useMessenger from '@sl/layouts/useMessenger'
import importBibisco from './importBibisco'

const BibiscoBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>
                <Link href='https://bibisco.com/' color='inherit'>
                    {t('view.storyline.import.bibisco.title')}
                </Link>
            </Typography>
            <Typography variant='body1'>{t('view.storyline.import.bibisco.text')}</Typography>
            <Button
                variant='contained'
                onClick={async () => {
                    const workId = await importBibisco(database)

                    if (workId) {
                        navigate(`/work/${workId}`)
                    } else {
                        messenger.error(t('view.storyline.import.bibisco.error'))
                    }
                }}>
                {t('view.storyline.import.button')}
            </Button>
        </Box>
    )
}

export default BibiscoBox
