import { useState, SyntheticEvent } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { useTranslation } from 'react-i18next'
import WordsByDay from './WordsByDay'
import WordsByPeriod from './WordsByPeriod'
import { Typography } from '@mui/material'

const PADDING = { padding: 0, height: '82%' }

const WordsBox = () => {
    const [value, setValue] = useState('line')
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
                    <Tab
                        label={
                            <Box className='w-full flex justify-between'>
                                <Typography variant='body2'>
                                    {t('view.work.insight.word.line')}
                                </Typography>
                            </Box>
                        }
                        value='line'
                    />
                    <Tab label={t('view.work.insight.word.bar')} value='bar' />
                </TabList>
            </Box>
            <TabPanel value='line' sx={PADDING}>
                <WordsByPeriod />
            </TabPanel>
            <TabPanel value='bar' sx={PADDING}>
                <WordsByDay />
            </TabPanel>
        </TabContext>
    )
}

export default WordsBox
