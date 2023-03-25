import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { WorkModel } from '@sl/db/models'
import WorkForm from '@sl/forms/Work/Work'

const EditWorkView = () => {
    const work = useRouteLoaderData('work') as WorkModel

    return (
        <FormWrapper model={work}>
            <WorkForm
                work={work}
                initialValues={{
                    title: work.title,
                    author: work.author,
                    summary: work.summary,
                    language: 'en-gb',
                    wordGoal: work.wordGoal || 0,
                    image: work.image,
                    deadlineAt: work.deadlineAt
                }}
            />
        </FormWrapper>
    )
}

export default EditWorkView
