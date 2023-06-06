import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useRouteLoaderData } from 'react-router-dom'
import { CharacterMode, CharacterModeType } from '@sl/constants/characterMode'
import { WorkModel } from '@sl/db/models'
import { CharacterDataType } from '@sl/db/models/types'
import CharacterForm from '@sl/forms/Work/Character'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const AddCharacterView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const params = useParams()
    const layout = useLayout()
    const { t } = useTranslation()

    const getTitle = (): string => {
        return {
            [CharacterMode.PRIMARY]: t('layout.work.panel.character.addPrimary'),
            [CharacterMode.SECONDARY]: t('layout.work.panel.character.addSecondary'),
            [CharacterMode.TERTIARY]: t('layout.work.panel.character.addTertiary')
        }[initialValues.mode]
    }

    const initialValues = {
        ...(getInitialValues('character', ['work_id']) as CharacterDataType),
        ['mode']: params.mode as CharacterModeType
    }

    useEffect(() => {
        layout.setTitle(getTitle())
    }, [params.mode])

    return <CharacterForm title={getTitle()} work={work} initialValues={initialValues} />
}

export default AddCharacterView
