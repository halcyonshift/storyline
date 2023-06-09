import { Box, Button, Typography } from '@mui/material'
import IDBExportImport from 'indexeddb-export-import'
import { useTranslation } from 'react-i18next'
import useMessenger from '@sl/layouts/useMessenger'
import { useDatabase } from '@nozbe/watermelondb/hooks'

const BackupBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const { t } = useTranslation()

    const exportDb = async () => {
        const openDb: IDBOpenDBRequest = window.indexedDB.open(
            database.adapter.dbName,
            database.adapter.schema.version
        )
        openDb.onsuccess = (event: Event) => {
            const target = event.target as IDBOpenDBRequest
            IDBExportImport.exportToJsonString(
                target.result,
                async (_: Error, jsonString: string) => {
                    const filePath = await api.backupStoryLine(jsonString)
                    if (filePath) {
                        messenger.success(
                            t('view.storyline.backupRestore.backup.storyline.success', { filePath })
                        )
                    } else {
                        messenger.success(
                            t('view.storyline.backupRestore.backup.storyline.failure')
                        )
                    }
                }
            )
        }
    }

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>
                {t('view.storyline.backupRestore.backup.storyline.title')}
            </Typography>
            <Typography variant='body1'>
                {t('view.storyline.backupRestore.backup.storyline.text')}
            </Typography>
            <Button variant='contained' onClick={exportDb}>
                {t('view.storyline.backupRestore.backup.storyline.button')}
            </Button>
        </Box>
    )
}

export default BackupBox
