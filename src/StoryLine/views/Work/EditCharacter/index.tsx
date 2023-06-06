import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { CharacterModel } from '@sl/db/models'
import { CharacterDataType } from '@sl/db/models/types'
import CharacterForm from '@sl/forms/Work/Character'
import { getInitialValues } from '@sl/forms/Work/utils'
import useLayout from '@sl/layouts/Work/useLayout'

const EditCharacterView = () => {
    const character = useRouteLoaderData('character') as CharacterModel
    const initialValues = Object.keys({
        ...(getInitialValues('character', ['work_id', 'status', 'mode']) as CharacterDataType)
    }).reduce(
        (o, key) => ({ ...o, [key]: character[key as keyof CharacterModel] }),
        {}
    ) as CharacterDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(t('layout.work.panel.character.edit'))
        setBreadcrumbs([
            {
                label: character.displayName,
                tab: { id: character.id, mode: 'character' }
            }
        ])
    }, [character.id])

    return <CharacterForm character={character} initialValues={initialValues} />
}

export default EditCharacterView
