import { useEffect, useState, SyntheticEvent } from 'react'
import { faker as en } from '@faker-js/faker/locale/en'
import { faker as fr } from '@faker-js/faker/locale/fr'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Stack, Tab, Typography } from '@mui/material'
import sampleSize from 'lodash/sampleSize'
import sample from 'lodash/sample'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { CHARACTER_TRAITS, PROMPTS } from '@sl/constants/random'
import useSettings from '@sl/theme/useSettings'
import { RandomCharacterType } from './types'

const RandomBox = () => {
    const [value, setValue] = useState('1')
    const [character, setCharacter] = useState<RandomCharacterType>()
    const [prompt, setPrompt] = useState<string>('')
    const settings = useSettings()
    const { t } = useTranslation()

    const generateCharacter = () => {
        const lang = settings.language == 'en' ? en : fr
        setCharacter({
            name: lang.name.fullName(),
            job: lang.name.jobTitle(),
            dateOfBirth: DateTime.fromJSDate(lang.date.birthdate())
                .setLocale(settings.language)
                ?.toLocaleString(DateTime.DATE_SHORT),
            traits: sampleSize(CHARACTER_TRAITS, 3)
                .map((trait) => t(`constant.random.characterTrait.${trait}`))
                .join(', ')
        })
    }

    const randomPrompt = () => {
        setPrompt(
            t(
                `constant.random.prompts.prompt_${sample(
                    Array.from({ length: PROMPTS }, (_, k) => k + 1)
                )}`
            )
        )
    }

    useEffect(() => {
        generateCharacter()
        randomPrompt()
    }, [])

    return (
        <Box className='relative'>
            <TabContext value={value}>
                <Box className='border-b'>
                    <TabList
                        variant='fullWidth'
                        onChange={(_: SyntheticEvent, newValue: string) => {
                            setValue(newValue)
                        }}
                        aria-label=''>
                        <Tab label={t('view.work.dashboard.random.character')} value='1' />
                        <Tab label={t('view.work.dashboard.random.prompt')} value='2' />
                    </TabList>
                </Box>
                <TabPanel value='1'>
                    <Stack direction='row' spacing={3}>
                        <Box className='flex-grow'>
                            {character?.name ? (
                                <>
                                    <Typography variant='h6'>{character.name}</Typography>
                                    <Typography variant='body1'>{character.dateOfBirth}</Typography>
                                    <Typography variant='body1'>{character.job}</Typography>
                                    <Typography variant='body2'>{character.traits}</Typography>
                                </>
                            ) : null}
                        </Box>
                        <Box>
                            <TooltipIconButton
                                text={t('view.work.dashboard.random.generate')}
                                icon={GLOBAL_ICONS.random}
                                onClick={() => generateCharacter()}
                            />
                        </Box>
                    </Stack>
                </TabPanel>
                <TabPanel value='2'>
                    <Stack direction='row' spacing={3}>
                        <Typography variant='body1'>{prompt}</Typography>
                        <Box>
                            <TooltipIconButton
                                text={t('view.work.dashboard.random.generate')}
                                icon={GLOBAL_ICONS.random}
                                onClick={() => randomPrompt()}
                            />
                        </Box>
                    </Stack>
                </TabPanel>
            </TabContext>
        </Box>
    )
}
export default RandomBox
