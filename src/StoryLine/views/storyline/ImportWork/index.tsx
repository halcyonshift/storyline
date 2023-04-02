import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import useMessenger from '@sl/layouts/useMessenger'
import importBibisco from './importBibisco'
import { useNavigate } from 'react-router-dom'

const ImportWorkView = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Box>
            <Typography variant='h4'>{t('view.storyline.importWork.title')}</Typography>
            <Typography variant='h6'>{t('view.storyline.importWork.bibisco.title')}</Typography>
            <Typography variant='body1'>{t('view.storyline.importWork.bibisco.text')}</Typography>
            <Button
                variant='contained'
                onClick={async () => {
                    const workId = await importBibisco(database)

                    if (workId) {
                        navigate(`/works/${workId}`)
                    } else {
                        messenger.error(t('view.storyline.importWork.bibisco.error'))
                    }
                }}>
                {t('view.storyline.importWork.button')}
            </Button>
        </Box>
    )
}

export default ImportWorkView
