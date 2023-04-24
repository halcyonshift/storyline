import { useState, SyntheticEvent } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { useTranslation } from 'react-i18next'
import WordsByDay from './WordsByDay'
import WordsByPeriod from './WordsByPeriod'

const PADDING = { padding: 0, height: '82%' }

const WordsBox = () => {
    const [value, setValue] = useState('1')
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
                    <Tab label={t('view.work.insight.word.day')} value='1' />
                    <Tab label={t('view.work.insight.word.week')} value='2' />
                </TabList>
            </Box>
            <TabPanel value='1' sx={PADDING}>
                <WordsByPeriod />
            </TabPanel>
            <TabPanel value='2' sx={PADDING}>
                <WordsByDay />
            </TabPanel>
        </TabContext>
    )
}

export default WordsBox
