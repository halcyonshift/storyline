import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { useRouteLoaderData } from 'react-router-dom'
import CharacterModel from '@sl/db/models/CharacterModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const CharacterView = () => {
    const tabs = useTabs()
    const character = useRouteLoaderData('character') as CharacterModel

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return <Box className='p-5 border-t-8 border-slate-100'>{character.displayName}</Box>
}

export default CharacterView
