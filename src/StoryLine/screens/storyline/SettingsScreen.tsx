/** @format */

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'

import i18n from '../../i18n'
import { languageType } from '../../i18n/types'
import useColorMode from '../../ui/display/colorMode/hooks'
import { modeType } from '../../ui/display/colorMode/types'

const SettingsScreen = () => {
    const [language, setLanguage] = useState<languageType>('en')
    const [mode, setMode] = useState<modeType>('light')
    const colorMode = useColorMode()
    const database = useDatabase()
    const { t } = useTranslation()

    useEffect(() => {
        database.localStorage
            .get<languageType | null>('i18nextLng')
            .then((i18nextLng) => {
                setLanguage(i18nextLng || 'en')
            })
            .catch(() => null)

        database.localStorage
            .get<modeType | null>('mode')
            .then((mode) => {
                setMode(mode || 'light')
            })
            .catch(() => null)
    }, [])

    useEffect(() => {
        database.localStorage
            .set('i18nextLng', language)
            .then(() => {
                localStorage.setItem('i18nextLng', language)
            })
            .catch(() => null) // ToDo catch error
    }, [database.localStorage, language])

    useEffect(() => {
        database.localStorage.set('mode', mode).catch(() => null) // ToDo catch error
        colorMode.setMode(mode)
    }, [database.localStorage, mode])

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const value = event.target.value as languageType
        void i18n
            .changeLanguage(event.target.value, (err) => {
                if (err) {
                    console.log('something went wrong loading', err) // ToDo handle
                }
            })
            .then(() => setLanguage(value))
    }

    const handleModeChange = (event: SelectChangeEvent) => {
        const value = event.target.value as modeType
        setMode(value)
    }

    return (
        <Box className='grid grid-cols-3 gap-4'>
            <Box>
                <Typography variant='h4'>{t('screen.storyline.settings.title')}</Typography>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id='select-language'>
                            {t('screen.storyline.settings.language')}
                        </InputLabel>
                        <Select
                            labelId='select-language'
                            value={language}
                            label={t('screen.storyline.settings.language')}
                            onChange={handleLanguageChange}>
                            <MenuItem value='en'>English</MenuItem>
                            <MenuItem value='fr'>Français</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id='select-mode'>
                        {t('screen.storyline.settings.mode.title')}
                    </InputLabel>
                    <Select
                        labelId='select-mode'
                        value={mode}
                        label={t('screen.storyline.settings.mode.title')}
                        onChange={handleModeChange}>
                        <MenuItem value='light'>
                            {t('screen.storyline.settings.mode.light')}
                        </MenuItem>
                        <MenuItem value='dark'>{t('screen.storyline.settings.mode.dark')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box></Box>
        </Box>
    )
}

export default SettingsScreen
