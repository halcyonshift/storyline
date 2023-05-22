import { useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'

const RestoreWorkBox = () => {
    const [id, setId] = useState<string>(' ')
    const database = useDatabase()
    const messenger = useMessenger()
    const works = useObservable(
        () =>
            database
                .get<WorkModel>('work')
                .query(Q.sortBy('title', Q.asc))
                .observeWithColumns(['title']),
        [],
        []
    )

    const { t } = useTranslation()

    const restoreWork = async () => {
        let work: WorkModel

        try {
            work = await database.get<WorkModel>('work').find(id)
            work.delete()
        } catch {
            work = await database.write(async () => {
                return await database.get<WorkModel>('work').create((work) => {
                    work._raw.id = data.work[0].id
                    work.title = data.work[0].title
                })
            })
        }

        const { data } = await api.restoreWork()

        if (!data?.work[0]?.id) {
            messenger.error(t('view.storyline.backupRestore.restore.work.failure'))
            return
        }

        const status = await work.restore(data)

        if (status) {
            messenger.success(t('view.storyline.backupRestore.restore.work.success'))
        } else {
            messenger.error(t('view.storyline.backupRestore.restore.work.failure'))
        }
    }

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Box className='p-3 text-center w-full'>
                <Box className='grid grid-cols-1 gap-3'>
                    <FormControl fullWidth>
                        <InputLabel id='work-backup-label'>
                            {t('view.storyline.backupRestore.restore.work.label')}
                        </InputLabel>
                        <Select
                            labelId='work-backup-label'
                            id='work-backup-select'
                            value={id}
                            label='Work'
                            onChange={(event: SelectChangeEvent) =>
                                setId(event.target.value as string)
                            }>
                            <MenuItem value=''>
                                {t('view.storyline.backupRestore.restore.work.new')}
                            </MenuItem>
                            {works.map((work) => (
                                <MenuItem key={work.id} value={work.id}>
                                    {work.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={restoreWork} variant='contained'>
                        {t('view.storyline.backupRestore.restore.work.button')}
                    </Button>
                    <Typography variant='body1' className='text-amber-600 p-5'>
                        {t('view.storyline.backupRestore.restore.work.text')}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default RestoreWorkBox
