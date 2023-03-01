/** @format */

import { useEffect, useState } from 'react'

import TextDecreaseIcon from '@mui/icons-material/TextDecrease'
import TextIncreaseIcon from '@mui/icons-material/TextIncrease'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'

import i18n from '../../../i18n'
import { languageType } from '../../../i18n/types'
import useDisplay from '../../../ui/hooks/theme/useDisplay'
import { fontType, modeType } from '../../../ui/hooks/theme/types'

const SettingsScreen = () => {
    const database = useDatabase()
    const display = useDisplay()
    const { t } = useTranslation()

    const [language, setLanguage] = useState<languageType>('en')
    const [mode, setMode] = useState<modeType>(display.mode)
    const [font, setFont] = useState<fontType>(display.font)
    const [fontSize, setFontSize] = useState<number>(display.fontSize)
    const [indent, setIndent] = useState<boolean>(false)

    useEffect(() => {
        database.localStorage
            .get<languageType | null>('i18nextLng')
            .then((i18nextLng) => {
                setLanguage(i18nextLng || 'en')
            })
            .catch(() => null)

        database.localStorage
            .get<boolean>('indent')
            .then((indent) => {
                setIndent(indent || false)
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
        display.setMode(mode)
    }, [database.localStorage, mode])

    useEffect(() => {
        database.localStorage.set('font', font).catch(() => null) // ToDo catch error
        display.setFont(font)
    }, [database.localStorage, font])

    useEffect(() => {
        database.localStorage.set('fontSize', fontSize).catch(() => null) // ToDo catch error
        display.setFontSize(fontSize)
    }, [database.localStorage, fontSize])

    useEffect(() => {
        database.localStorage.set('indent', indent).catch(() => null) // ToDo catch error
    }, [database.localStorage, indent])

    const handleFontChange = (event: SelectChangeEvent) => {
        const value = event.target.value as fontType
        setFont(value)
    }

    const handleIndentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIndent(event.target.checked)
    }

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const value = event.target.value as languageType
        void i18n.changeLanguage(event.target.value).then(() => setLanguage(value))
    }

    const handleModeChange = (event: SelectChangeEvent) => {
        const value = event.target.value as modeType
        setMode(value)
    }

    return (
        <Box className='grid grid-cols-3 gap-4'>
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
            <Box>
                <FormControl fullWidth>
                    <InputLabel id='select-font'>{t('screen.storyline.settings.font')}</InputLabel>
                    <Select
                        labelId='select-font'
                        value={font}
                        label={t('screen.storyline.settings.font')}
                        onChange={handleFontChange}>
                        <MenuItem value='arial'>Arial</MenuItem>
                        <MenuItem value='roboto'>Roboto</MenuItem>
                        <MenuItem value='times new roman'>Times New Roman</MenuItem>
                    </Select>
                    <Stack spacing={2} direction='row' alignItems='center'>
                        <TextDecreaseIcon />
                        <Slider
                            aria-label={t('screen.storyline.settings.fontSize')}
                            defaultValue={12}
                            getAriaValueText={(value) => value.toString()}
                            valueLabelDisplay='auto'
                            step={1}
                            marks
                            min={12}
                            max={28}
                            value={fontSize}
                            onChange={(_, value: number) => setFontSize(value)}
                        />
                        <TextIncreaseIcon />
                    </Stack>
                </FormControl>
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={indent}
                                onChange={handleIndentChange}
                                color='success'
                                aria-label={t('screen.storyline.settings.indent')}
                            />
                        }
                        label={t('screen.storyline.settings.indent')}
                    />
                </FormControl>
            </Box>
        </Box>
    )
}

export default SettingsScreen
