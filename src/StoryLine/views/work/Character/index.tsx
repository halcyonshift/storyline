import { useEffect } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import Image from '@sl/components/Image'
import CharacterModel from '@sl/db/models/CharacterModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { htmlParse } from '@sl/utils'

const CharacterView = () => {
    const tabs = useTabs()
    const character = useRouteLoaderData('character') as CharacterModel
    const { t } = useTranslation()

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    return (
        <Box className='p-5 border-t-8 border-slate-100'>
            <Stack spacing={3}>
                <Box className='grid grid-cols-2 gap-3'>
                    <Box>
                        <Typography variant='h4'>{character.displayName}</Typography>
                        <Typography variant='body1'>
                            {character.firstName} {character.lastName} ({character.nickname})
                        </Typography>
                        <Typography variant='body2'>{character.pronouns}</Typography>
                    </Box>
                    <Image path={character.image} />
                </Box>
                <Divider />
                {htmlParse(character.description)}
                <Divider />
            </Stack>
        </Box>
    )
}

export default CharacterView
