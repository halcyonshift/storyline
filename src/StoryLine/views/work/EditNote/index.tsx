import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { NoteModel } from '@sl/db/models'
import NoteForm from '@sl/forms/Work/Note'

const EditNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel

    return (
        <FormWrapper title={note.title} model={note}>
            <NoteForm
                note={note}
                initialValues={{
                    title: note.title,
                    body: note.body,
                    url: note.url,
                    date: note.date,
                    color: note.color,
                    image: note.image,
                    order: note.order
                }}
            />
        </FormWrapper>
    )
}

export default EditNoteView
