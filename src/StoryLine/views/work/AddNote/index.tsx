import { useTranslation } from 'react-i18next'
import { useLoaderData, useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import NoteForm from '@sl/forms/Work/Note'

const AddNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
    const work = useRouteLoaderData('work') as WorkModel
    const model = useLoaderData() as CharacterModel | ItemModel | LocationModel | SectionModel
    const { t } = useTranslation()

    return (
        <FormWrapper
            title={
                model
                    ? `${model.displayName}: ${t('view.work.addNote.title')}`
                    : note
                    ? `${note.title}: ${t('view.work.addNote.title')}`
                    : t('view.work.addNote.title')
            }>
            <NoteForm work={work} note={note} belongsTo={model} />
        </FormWrapper>
    )
}

export default AddNoteView
