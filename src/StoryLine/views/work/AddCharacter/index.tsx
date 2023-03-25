import { useTranslation } from 'react-i18next'
import { useParams, useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { CharacterModeType } from '@sl/constants/characterMode'
import { WorkModel } from '@sl/db/models'
import CharacterForm from '@sl/forms/Work/Character'

const AddCharacterView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const params = useParams()
    const { t } = useTranslation()

    return (
        <FormWrapper
            padding={false}
            title={t('view.work.addCharacter.title', {
                mode: t(`constant.characterMode.${params.mode}`).toLowerCase()
            })}>
            <CharacterForm work={work} mode={params.mode as CharacterModeType} />
        </FormWrapper>
    )
}

export default AddCharacterView
