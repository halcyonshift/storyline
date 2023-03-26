import { useParams, useRouteLoaderData } from 'react-router-dom'
import { CharacterModeType } from '@sl/constants/characterMode'
import { WorkModel } from '@sl/db/models'
import { CharacterDataType } from '@sl/db/models/types'
import CharacterForm from '@sl/forms/Work/Character'
import { getInitialValues } from '@sl/forms/Work/utils'

const AddCharacterView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const params = useParams()
    const initialValues = {
        ...(getInitialValues('character', ['work_id']) as CharacterDataType),
        ['mode']: params.mode as CharacterModeType
    }

    return <CharacterForm work={work} initialValues={initialValues} />
}

export default AddCharacterView
