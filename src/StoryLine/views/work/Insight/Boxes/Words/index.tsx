import { useState, SyntheticEvent } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { useTranslation } from 'react-i18next'
import SprintResults from './SprintResults'
import WordsByDay from './WordsByDay'
import WordsByPeriod from './WordsByPeriod'

const PADDING = { padding: 0, height: '82%' }

const WordsBox = () => {
    const [value, setValue] = useState('period')
    const { t } = useTranslation()

    return (
        <TabContext value={value}>
            <Box className='border-b'>
                <TabList
                    variant='fullWidth'
                    onChange={(_: SyntheticEvent, newValue: string) => {
                        setValue(newValue)
                    }}
                    aria-label=''>
                    <Tab label={t('view.work.insight.word.period')} value='period' />
                    <Tab label={t('view.work.insight.word.sprint')} value='sprint' />
                    <Tab label={t('view.work.insight.word.day')} value='day' />
                </TabList>
            </Box>
            <TabPanel value='period' sx={PADDING}>
                <WordsByPeriod />
            </TabPanel>
            <TabPanel value='sprint' sx={PADDING}>
                <SprintResults />
            </TabPanel>
            <TabPanel value='day' sx={PADDING}>
                <WordsByDay />
            </TabPanel>
        </TabContext>
    )
}

export default WordsBox
