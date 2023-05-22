import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'
import { useTranslation } from 'react-i18next'

const RestoreWorkBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const { t } = useTranslation()

    const restoreWork = async () => {
        let work: WorkModel

        const { images, data } = await api.restoreWork()

        if (!data?.work[0]?.id) {
            messenger.error(t('view.storyline.backupRestore.restore.work.failure'))
            return
        }

        try {
            work = await database.get<WorkModel>('work').find(data.work[0].id)
        } catch {
            work = await database.write(async () => {
                return await database.get<WorkModel>('work').create((work) => {
                    work._raw.id = data.work[0].id
                    work.title = data.work[0].title
                })
            })
        }

        const status = await work.restore(data, images)

        if (status) {
            messenger.success(t('view.storyline.backupRestore.restore.work.success'))
        } else {
            messenger.error(t('view.storyline.backupRestore.restore.work.failure'))
        }
    }

    return (
        <Box className='grid h-full place-items-center'>
            <Box className='p-3 text-center'>
                <Typography variant='body1' className='text-amber-600 p-5'>
                    {t('view.storyline.backupRestore.restore.work.text')}
                </Typography>
                <Button onClick={restoreWork} variant='contained'>
                    {t('view.storyline.backupRestore.restore.work.button')}
                </Button>
            </Box>
        </Box>
    )
}

export default RestoreWorkBox
