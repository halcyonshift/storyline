import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import NoteModel from '@sl/db/models/NoteModel'
import { NoteDataType } from '@sl/db/models/types'
import NoteForm from '@sl/forms/Work/Note'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'
import { BreadcrumbType, TabType } from '@sl/layouts/Work/types'

const EditNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
    const initialValues = Object.keys(
        getInitialValues('note', [
            'work_id',
            'character_id',
            'item_id',
            'location_id',
            'note_id',
            'section_id',
            'status'
        ]) as NoteDataType
    ).reduce((o, key) => ({ ...o, [key]: note[key as keyof NoteModel] }), {}) as NoteDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        note.getBreadcrumbs().then(async (breadcrumbs) => {
            const parents = []
            if (note.character.id) parents.push(await note.character.fetch())
            if (note.item.id) parents.push(await note.item.fetch())
            if (note.location.id) parents.push(await note.location.fetch())
            if (note.section.id) parents.push(await note.section.fetch())

            const parentBreadcrumbs = parents.map((parent) => ({
                label: parent.displayName,
                tab: { id: parent.id, mode: parent.table } as TabType
            })) as BreadcrumbType[]
            setTitle(t('layout.work.panel.note.edit'))
            setBreadcrumbs(parentBreadcrumbs.concat(breadcrumbs))
        })
    }, [note.id])

    return <NoteForm note={note} initialValues={initialValues} />
}

export default EditNoteView
