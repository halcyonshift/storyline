import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { CharacterMode, CharacterModeType } from '@sl/constants/characterMode'
import { CHARACTER_ICONS } from '@sl/constants/icons'
import { CharacterDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import * as Panel from './TabPanel'
import { CharacterFormProps } from './types'

const CharacterForm = ({ work, character, initialValues }: CharacterFormProps) => {
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [headerMode, setHeaderMode] = useState<CharacterModeType>(initialValues.mode)

    useEffect(() => {
        setHeaderMode(initialValues.mode)
    }, [initialValues.mode])

    useEffect(() => {
        if (character) {
            character.updateMode(headerMode)
        }
    }, [headerMode])

    const validationSchema = yup.object({
        image: yup.string().nullable(),
        displayName: yup.string().required(t('form.work.character.displayName.required')),
        description: yup.string().nullable(),
        history: yup.string().nullable(),
        pronouns: yup.string().nullable(),
        firstName: yup.string().nullable(),
        lastName: yup.string().nullable(),
        nickname: yup.string().nullable(),
        nationality: yup.string().nullable(),
        ethnicity: yup.string().nullable(),
        placeOfBirth: yup.string().nullable(),
        residence: yup.string().nullable(),
        gender: yup.string().nullable(),
        sexualOrientation: yup.string().nullable(),
        dateOfBirth: yup.string().nullable(),
        apparentAge: yup.string().nullable(),
        religion: yup.string().nullable(),
        socialClass: yup.string().nullable(),
        education: yup.string().nullable(),
        profession: yup.string().nullable(),
        finances: yup.string().nullable(),
        politicalLeaning: yup.string().nullable(),
        face: yup.string().nullable(),
        build: yup.string().nullable(),
        height: yup.string().nullable(),
        weight: yup.string().nullable(),
        hair: yup.string().nullable(),
        hairNatural: yup.string().nullable(),
        distinguishingFeatures: yup.string().nullable(),
        personalityPositive: yup.string().nullable(),
        personalityNegative: yup.string().nullable(),
        ambitions: yup.string().nullable(),
        fears: yup.string().nullable()
    })

    const getTitle = (): string => {
        if (character) return character.displayName

        return {
            [CharacterMode.PRIMARY]: t('layout.work.panel.character.addPrimary'),
            [CharacterMode.SECONDARY]: t('layout.work.panel.character.addSecondary'),
            [CharacterMode.TERTIARY]: t('layout.work.panel.character.addTertiary')
        }[initialValues.mode]
    }

    const form: FormikProps<CharacterDataType> = useFormik<CharacterDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: CharacterDataType) => {
            if (character) {
                await character.updateCharacter(values)
            } else {
                character = await work.addCharacter(initialValues.mode, values)
            }
            messenger.success(t('form.work.character.alert.success'))
            navigate(`/work/${work.id}/character/${character.id}/edit`)
        }
    })

    return (
        <FormWrapper
            form={form}
            title={getTitle()}
            model={character}
            header={
                character ? (
                    <Box>
                        <TooltipIconButton
                            color={headerMode === CharacterMode.PRIMARY ? 'primary' : 'inherit'}
                            icon={CHARACTER_ICONS.primary}
                            text='constant.characterMode.PRIMARY'
                            onClick={() => setHeaderMode(CharacterMode.PRIMARY)}
                        />
                        <TooltipIconButton
                            color={headerMode === CharacterMode.SECONDARY ? 'primary' : 'inherit'}
                            icon={CHARACTER_ICONS.secondary}
                            text='constant.characterMode.SECONDARY'
                            onClick={() => setHeaderMode(CharacterMode.SECONDARY)}
                        />
                        <TooltipIconButton
                            color={headerMode === CharacterMode.TERTIARY ? 'primary' : 'inherit'}
                            icon={CHARACTER_ICONS.tertiary}
                            text='constant.characterMode.TERTIARY'
                            onClick={() => setHeaderMode(CharacterMode.TERTIARY)}
                        />
                    </Box>
                ) : null
            }
            tabList={[
                t('component.formWrapper.tab.general'),
                t('form.work.character.tab.demographics'),
                t('form.work.character.tab.appearance'),
                t('form.work.character.tab.about')
            ]}>
            <Panel.General form={form} />
            <Panel.Demographics form={form} />
            <Panel.Appearance form={form} />
            <Panel.About form={form} />
        </FormWrapper>
    )
}

export default CharacterForm
