import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ViewWrapper from '@sl/components/ViewWrapper'
import NoteModel from '@sl/db/models/NoteModel'
import useLayout from '@sl/layouts/Work/useLayout'
import { BreadcrumbType, TabType } from '@sl/layouts/Work/types'
import { htmlParse } from '@sl/utils/html'

const NoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        note.getBreadcrumbs(false).then(async (breadcrumbs) => {
            const parents = []
            if (note.character.id) parents.push(await note.character.fetch())
            if (note.item.id) parents.push(await note.item.fetch())
            if (note.location.id) parents.push(await note.location.fetch())
            if (note.section.id) parents.push(await note.section.fetch())
            const parentBreadcrumbs = parents.map((parent) => ({
                label: parent.displayName,
                tab: { id: parent.id, mode: parent.table } as TabType
            })) as BreadcrumbType[]
            setTitle(note.displayName)
            setBreadcrumbs(parentBreadcrumbs.concat(breadcrumbs))
        })
    }, [note.id])

    return (
        <ViewWrapper tabList={[t('component.viewWrapper.tab.general')]} model={note}>
            <Box className='py-3'>{htmlParse(note.body)}</Box>
        </ViewWrapper>
    )
}

export default NoteView
