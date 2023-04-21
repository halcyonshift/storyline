import { Box, Button, Typography } from '@mui/material'
import useMessenger from '@sl/layouts/useMessenger'
import { useTranslation } from 'react-i18next'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useNavigate } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'

const StoryLineBox = () => {
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const importWork = async () => {
        const { images, data } = await api.restore()

        try {
            await database.get<WorkModel>('work').find(data.work[0].id)
            messenger.error(t('view.storyline.importWork.storyLine.error'))
            return false
        } catch {
            //
        }

        const work = await database.write(async () => {
            return await database.get<WorkModel>('work').create((work) => {
                work._raw.id = data.work[0].id
                work.title = data.work[0].title
                work.author = data.work[0].author
                work.language = data.work[0].language
                work.status = data.work[0].status
            })
        })

        const status = await work.restore(data, images)

        if (status) {
            navigate(`/work/${work.id}`)
        } else {
            messenger.error(t('view.storyline.importWork.storyLine.failure'))
        }
    }

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>{t('view.storyline.importWork.storyLine.title')}</Typography>
            <Typography variant='body1'>{t('view.storyline.importWork.storyLine.text')}</Typography>
            <Button variant='contained' onClick={importWork}>
                {t('view.storyline.importWork.button')}
            </Button>
        </Box>
    )
}

export default StoryLineBox
