import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import CharacterModel from '@sl/db/models/CharacterModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const CharacterView = () => {
    const tabs = useTabs()
    const character = useRouteLoaderData('character') as CharacterModel

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return <p>{character.displayName}</p>
}

export default CharacterView
