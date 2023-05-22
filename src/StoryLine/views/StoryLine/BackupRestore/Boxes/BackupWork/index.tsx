import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material'

import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'

const BackupWorkBox = () => {
    const [id, setId] = useState<string>()
    const database = useDatabase()
    const messenger = useMessenger()
    const { t } = useTranslation()
    const works = useObservable(
        () =>
            database
                .get<WorkModel>('work')
                .query(Q.sortBy('title', Q.asc))
                .observeWithColumns(['title']),
        [],
        []
    )

    const backupWork = async () => {
        const work = await database.get<WorkModel>('work').find(id)

        const { data, images, backupPath } = await work.backup()
        const filePath = await api.backupWork(data, images, backupPath)

        if (filePath) {
            messenger.success(t('view.storyline.backupRestore.backup.work.success', { filePath }))
        } else {
            messenger.error(t('view.storyline.backupRestore.backup.work.failure'))
        }
    }

    useEffect(() => {
        setId(works.length ? works[0].id : '')
    }, [works.length])

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Box className='p-3 text-center w-full'>
                {id ? (
                    <Box className='grid grid-cols-1 gap-3'>
                        <FormControl fullWidth>
                            <InputLabel id='work-backup-label'>
                                {t('view.storyline.backupRestore.backup.work.label')}
                            </InputLabel>
                            <Select
                                labelId='work-backup-label'
                                id='work-backup-select'
                                value={id}
                                label='Work'
                                onChange={(event: SelectChangeEvent) =>
                                    setId(event.target.value as string)
                                }>
                                {works.map((work) => (
                                    <MenuItem key={work.id} value={work.id}>
                                        {work.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={backupWork} variant='contained'>
                            {t('view.storyline.backupRestore.backup.work.button')}
                        </Button>
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

export default BackupWorkBox
