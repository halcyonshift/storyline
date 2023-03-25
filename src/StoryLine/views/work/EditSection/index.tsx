import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { SectionModel } from '@sl/db/models'
import SectionForm from '@sl/forms/Work/Section'

const EditSectionView = () => {
    const section = useRouteLoaderData('section') as SectionModel
    return (
        <FormWrapper model={section} title={section.displayTitle}>
            <SectionForm
                section={section}
                initialValues={{
                    title: section.title,
                    description: section.description,
                    wordGoal: section.wordGoal,
                    deadlineAt: section.deadlineAt,
                    order: section.order,
                    date: section.date,
                    pointOfView: section.pointOfView,
                    pointOfViewCharacter: section.pointOfViewCharacter?.id
                }}
            />
        </FormWrapper>
    )
}

export default EditSectionView
