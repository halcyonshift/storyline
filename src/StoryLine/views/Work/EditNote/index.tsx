import { useRouteLoaderData } from 'react-router-dom'
import NoteModel from '@sl/db/models/NoteModel'
import { NoteDataType } from '@sl/db/models/types'
import NoteForm from '@sl/forms/Work/Note'
import { getInitialValues } from '@sl/forms/Work/utils'

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

    return <NoteForm note={note} initialValues={initialValues} />
}

export default EditNoteView
