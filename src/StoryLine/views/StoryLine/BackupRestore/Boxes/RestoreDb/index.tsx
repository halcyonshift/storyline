import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import useMessenger from '@sl/layouts/useMessenger'
import IDBExportImport from 'indexeddb-export-import'
import { useTranslation } from 'react-i18next'

const RestoreDbBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const { t } = useTranslation()

    const importDb = async () => {
        const jsonString = await api.restoreStoryLine()
        if (!jsonString) return

        const openDb: IDBOpenDBRequest = window.indexedDB.open(
            database.adapter.dbName,
            database.adapter.schema.version
        )

        openDb.onsuccess = (event: Event) => {
            const target = event.target as IDBOpenDBRequest

            IDBExportImport.clearDatabase(target.result, (error: Error) => {
                if (!error) {
                    IDBExportImport.importFromJsonString(
                        target.result,
                        jsonString,
                        (error: Error) => {
                            if (!error) {
                                messenger.success(
                                    t('view.storyline.backupRestore.restore.storyline.success')
                                )
                                api.relaunch()
                            } else {
                                messenger.success(
                                    t('view.storyline.backupRestore.restore.storyline.failure')
                                )
                            }
                        }
                    )
                }
            })
        }
    }

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>
                {t('view.storyline.backupRestore.restore.storyline.title')}
            </Typography>
            <Typography variant='body1'>
                {t('view.storyline.backupRestore.restore.storyline.text')}
            </Typography>
            <Button variant='contained' onClick={importDb}>
                {t('view.storyline.backupRestore.restore.storyline.button')}
            </Button>
        </Box>
    )
}

export default RestoreDbBox
