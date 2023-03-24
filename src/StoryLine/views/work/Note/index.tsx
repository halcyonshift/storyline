import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { useRouteLoaderData } from 'react-router-dom'
import NoteModel from '@sl/db/models/CharacterModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const NoteView = () => {
    const tabs = useTabs()
    const note = useRouteLoaderData('note') as NoteModel

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return <Box className='p-5 border-t-8 border-slate-100'>{note.displayName}</Box>
}

export default NoteView
