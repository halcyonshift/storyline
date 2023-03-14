import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useParams, useRouteLoaderData } from 'react-router-dom'
import { CharacterModeType } from '@sl/constants/characterMode'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/useTabs'
import CharacterForm from '@sl/forms/Work/Character'

const AddCharacterView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const params = useParams()
    const { t } = useTranslation()
    const tabs = useTabs()

    useEffect(() => {
        tabs.setShowTabs(false)
    }, [])

    return (
        <Box className='flex-grow flex flex-col'>
            <Typography variant='h6'>
                {t('view.work.addCharacter.title', {
                    mode: t(`constant.characterMode.${params.mode}`).toLowerCase()
                })}
            </Typography>
            <Divider />
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <CharacterForm work={work} mode={params.mode as CharacterModeType} />
            </Box>
        </Box>
    )
}

export default AddCharacterView
