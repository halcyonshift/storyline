import { Box, Button, Typography } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'
import { useTranslation } from 'react-i18next'

const BackupBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const messenger = useMessenger()
    const { t } = useTranslation()

    const backupWork = async () => {
        const { data, images, backupPath } = await work.backup()
        const filePath = await api.backup(data, images, backupPath)

        if (filePath) {
            messenger.success(t('view.work.backupRestore.backup.success', { filePath }))
        } else {
            messenger.error(t('view.work.backupRestore.backup.failure'))
        }
    }

    return (
        <Box className='grid h-full place-items-center'>
            <Box className='p-3 text-center'>
                <Typography variant='body2' className='text-teal-600 p-5'>
                    {t('view.work.backupRestore.backup.text')}
                </Typography>
                <Button onClick={backupWork} variant='contained'>
                    {t('view.work.backupRestore.backup.button')}
                </Button>
            </Box>
        </Box>
    )
}

export default BackupBox
