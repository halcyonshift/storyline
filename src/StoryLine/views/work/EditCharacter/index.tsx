import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useRouteLoaderData } from 'react-router-dom'
import { CharacterModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/useTabs'

import CharacterForm from '@sl/forms/Work/Character'

const EditCharacterView = () => {
    const character = useRouteLoaderData('character') as CharacterModel
    const tabs = useTabs()

    useEffect(() => {
        tabs.setShowTabs(false)
    }, [])

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {character.displayName}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <CharacterForm
                    character={character}
                    initialValues={{
                        mode: character.mode,
                        image: character.image,
                        displayName: character.displayName,
                        description: character.description,
                        history: character.history,
                        pronouns: character.pronouns,
                        firstName: character.firstName,
                        lastName: character.lastName,
                        nickname: character.nickname,
                        nationality: character.nationality,
                        ethnicity: character.ethnicity,
                        placeOfBirth: character.placeOfBirth,
                        residence: character.residence,
                        gender: character.gender,
                        sexualOrientation: character.sexualOrientation,
                        dateOfBirth: character.dateOfBirth,
                        apparentAge: character.apparentAge,
                        religion: character.religion,
                        socialClass: character.socialClass,
                        education: character.education,
                        profession: character.profession,
                        finances: character.finances,
                        politicalLeaning: character.politicalLeaning,
                        face: character.face,
                        build: character.build,
                        height: character.height,
                        weight: character.weight,
                        hair: character.hair,
                        hairNatural: character.hairNatural,
                        distinguishingFeatures: character.distinguishingFeatures,
                        personalityPositive: character.personalityPositive,
                        personalityNegative: character.personalityNegative,
                        ambitions: character.ambitions,
                        fears: character.fears
                    }}
                />
            </Box>
        </Box>
    )
}

export default EditCharacterView
