import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { CharacterMode, CharacterModeType } from '@sl/constants/characterMode'
import { CHARACTER_ICONS } from '@sl/constants/icons'
import { CharacterModel } from '@sl/db/models'
import CharacterForm from '@sl/forms/Work/Character'

const EditCharacterView = () => {
    const character = useRouteLoaderData('character') as CharacterModel
    const [mode, setMode] = useState<CharacterModeType>(character.mode)

    useEffect(() => {
        character.updateMode(mode)
    }, [mode])

    return (
        <FormWrapper
            title={character.displayName}
            model={character}
            header={
                <Box>
                    <TooltipIconButton
                        color={mode === CharacterMode.PRIMARY ? 'primary' : 'inherit'}
                        icon={CHARACTER_ICONS.primary}
                        text='constant.characterMode.PRIMARY'
                        onClick={() => setMode(CharacterMode.PRIMARY)}
                    />
                    <TooltipIconButton
                        color={mode === CharacterMode.SECONDARY ? 'primary' : 'inherit'}
                        icon={CHARACTER_ICONS.secondary}
                        text='constant.characterMode.SECONDARY'
                        onClick={() => setMode(CharacterMode.SECONDARY)}
                    />
                    <TooltipIconButton
                        color={mode === CharacterMode.TERTIARY ? 'primary' : 'inherit'}
                        icon={CHARACTER_ICONS.tertiary}
                        text='constant.characterMode.TERTIARY'
                        onClick={() => setMode(CharacterMode.TERTIARY)}
                    />
                </Box>
            }>
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
        </FormWrapper>
    )
}

export default EditCharacterView
