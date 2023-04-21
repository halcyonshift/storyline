import { Box, Button, Typography } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'
import { useTranslation } from 'react-i18next'

const RestoreBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const messenger = useMessenger()
    const { t } = useTranslation()

    const restoreWork = async () => {
        const { images, data } = await api.restore()

        if (data.work[0].id !== work.id) {
            messenger.error(t('view.work.backupRestore.restore.failure'))
            return
        }

        const status = await work.restore(data, images)

        if (status) {
            messenger.success(t('view.work.backupRestore.restore.success'))
        } else {
            messenger.error(t('view.work.backupRestore.restore.failure'))
        }
    }

    return (
        <Box className='grid h-full place-items-center'>
            <Box className='p-3 text-center'>
                <Typography variant='body2' className='text-amber-600 p-5'>
                    {t('view.work.backupRestore.restore.text')}
                </Typography>
                <Button onClick={restoreWork} variant='contained'>
                    {t('view.work.backupRestore.restore.button')}
                </Button>
            </Box>
        </Box>
    )
}

export default RestoreBox
