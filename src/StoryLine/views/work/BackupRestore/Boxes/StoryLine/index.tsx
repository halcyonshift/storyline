import { Box, Button } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'
import { useTranslation } from 'react-i18next'

const StoryLineBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const messenger = useMessenger()
    const { t } = useTranslation()

    const exportArchive = async () => {
        const { data, images, backupPath } = await work.backup()
        const filePath = await api.backup(data, images, backupPath)

        if (filePath) {
            messenger.success(t('view.work.backupRestore.storyline.success', { filePath }))
        } else {
            messenger.error(t('view.work.backupRestore.storyline.failure'))
        }
    }

    return (
        <Box>
            <Button onClick={exportArchive}>
                {t('view.work.backupRestore.storyline.button.backup')}
            </Button>
        </Box>
    )
}

export default StoryLineBox
