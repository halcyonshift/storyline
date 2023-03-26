import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import WorkForm from '@sl/forms/Work/Work'

const EditWorkView = () => {
    const work = useRouteLoaderData('work') as WorkModel

    return (
        <WorkForm
            work={work}
            initialValues={{
                title: work.title,
                author: work.author,
                summary: work.summary,
                language: work.language,
                wordGoal: work.wordGoal || 0,
                image: work.image,
                deadlineAt: work.deadlineAt
            }}
        />
    )
}

export default EditWorkView
