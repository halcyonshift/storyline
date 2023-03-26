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
import { getInitialValues } from '@sl/forms/Work/utils'

const AddNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
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

    return <NoteForm work={work} note={note} belongsTo={model} initialValues={initialValues} />
}

export default AddNoteView
