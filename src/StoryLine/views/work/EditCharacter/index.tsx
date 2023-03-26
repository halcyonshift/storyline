import { useRouteLoaderData } from 'react-router-dom'
import { CharacterModel } from '@sl/db/models'
import { CharacterDataType } from '@sl/db/models/types'
import CharacterForm from '@sl/forms/Work/Character'
import { getInitialValues } from '@sl/forms/Work/utils'

const EditCharacterView = () => {
    const character = useRouteLoaderData('character') as CharacterModel
    const initialValues = Object.keys({
        ...(getInitialValues('character', ['work_id']) as CharacterDataType)
    }).reduce(
        (o, key) => ({ ...o, [key]: character[key as keyof CharacterModel] }),
        {}
    ) as CharacterDataType

    return <CharacterForm character={character} initialValues={initialValues} />
}

export default EditCharacterView
