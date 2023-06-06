import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useRouteLoaderData } from 'react-router-dom'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import { NoteDataType } from '@sl/db/models/types'
import NoteForm from '@sl/forms/Work/Note'
import useLayout from '@sl/layouts/Work/useLayout'
import { getInitialValues } from '@sl/forms/Work/utils'

const AddNoteView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const model = useLoaderData() as
        | CharacterModel
        | ItemModel
        | LocationModel
        | NoteModel
        | SectionModel
    const initialValues = getInitialValues('note', [
        'work_id',
        'character_id',
        'item_id',
        'location_id',
        'note_id',
        'section_id'
    ]) as NoteDataType
    const { setTitle, setBreadcrumbs } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        if (model) {
            model.getBreadcrumbs().then((breadcrumbs) => setBreadcrumbs(breadcrumbs))
        } else {
            setBreadcrumbs([])
        }
        setTitle(t('layout.work.panel.note.addNote'))
    }, [model?.id])

    return <NoteForm work={work} belongsTo={model} initialValues={initialValues} />
}

export default AddNoteView
