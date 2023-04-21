import { Box, Button, Typography } from '@mui/material'
import useMessenger from '@sl/layouts/useMessenger'
import { useTranslation } from 'react-i18next'
import importBibisco from './importBibisco'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useNavigate } from 'react-router-dom'

const BibiscoBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>{t('view.storyline.importWork.bibisco.title')}</Typography>
            <Typography variant='body1'>{t('view.storyline.importWork.bibisco.text')}</Typography>
            <Button
                variant='contained'
                onClick={async () => {
                    const workId = await importBibisco(database)

                    if (workId) {
                        navigate(`/work/${workId}`)
                    } else {
                        messenger.error(t('view.storyline.importWork.bibisco.error'))
                    }
                }}>
                {t('view.storyline.importWork.button')}
            </Button>
        </Box>
    )
}

export default BibiscoBox
