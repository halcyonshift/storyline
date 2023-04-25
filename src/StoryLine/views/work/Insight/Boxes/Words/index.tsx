import { useState, SyntheticEvent } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import WordsByDay from './WordsByDay'
import WordsByPeriod from './WordsByPeriod'
import { Typography } from '@mui/material'
import { CalendarMonth } from '@mui/icons-material'

const PADDING = { padding: 0, height: '82%' }

const WordsBox = () => {
    const [value, setValue] = useState('line')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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
                                {value === 'line' ? (
                                    <IconButton
                                        sx={{ padding: 0 }}
                                        id='datepicker-button'
                                        aria-controls={anchorEl ? 'datepicker-menu' : undefined}
                                        aria-haspopup='true'
                                        aria-expanded={anchorEl ? 'true' : undefined}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setAnchorEl(e.currentTarget)
                                        }}>
                                        <CalendarMonth fontSize='small' />
                                    </IconButton>
                                ) : null}
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
            <Menu
                id='datepicker-menu'
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'datepicker-button'
                }}>
                <MenuItem>Datepicker</MenuItem>
            </Menu>
        </TabContext>
    )
}

export default WordsBox
