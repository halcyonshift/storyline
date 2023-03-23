import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import Status from '@sl/components/Status'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import { CharacterModel } from '@sl/db/models'
import CharacterForm from '@sl/forms/Work/Character'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const EditCharacterView = () => {
    const character = useRouteLoaderData('character') as CharacterModel
    const tabs = useTabs()
    const { t } = useTranslation()

    useEffect(() => tabs.setShowTabs(false), [])

    return (
        <Box className='flex flex-col flex-grow'>
            <Box className='px-4 py-2 flex justify-between'>
                <Typography variant='h6'>{character.displayName}</Typography>
                <Stack spacing={1} direction='row'>
                    <ButtonGroup size='small' variant='outlined'>
                        {Object.keys(CharacterMode).map((option: CharacterModeType) => (
                            <Button
                                disableElevation
                                color={option === character.mode ? 'primary' : 'inherit'}
                                variant='contained'
                                key={option}
                                value={option}
                                onClick={() => character.updateMode(option)}>
                                {t(`constant.characterMode.${option}`)}
                            </Button>
                        ))}
                    </ButtonGroup>
                    <Status model={character} />
                </Stack>
            </Box>
            <Divider />
            <Box className='flex-grow h-0 overflow-auto'>
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
