import { useRouteLoaderData } from 'react-router-dom'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import NoteModel from '@sl/db/models/NoteModel'
import { htmlParse } from '@sl/utils/html'
import ViewWrapper from '@sl/components/ViewWrapper'

const NoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
    const { t } = useTranslation()

    return (
        <ViewWrapper tabList={[t('component.viewWrapper.tab.general')]} model={note}>
            <Box className='py-3'>{htmlParse(note.body)}</Box>
        </ViewWrapper>
    )
}

export default NoteView
