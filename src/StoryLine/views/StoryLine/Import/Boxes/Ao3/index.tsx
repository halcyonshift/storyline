import { useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Typography
} from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Link from '@sl/components/Link'
import useMessenger from '@sl/layouts/useMessenger'
import useSettings from '@sl/theme/useSettings'
import importAo3 from './importAo3'

type ModeType = 'series' | 'work'

const Ao3Box = () => {
    const [id, setId] = useState<number>()
    const [importing, setImporting] = useState<boolean>(false)
    const [mode, setMode] = useState<ModeType>('work')
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { appFontSize } = useSettings()
    const { t } = useTranslation()

    const handleImport = async () => {
        setImporting(true)
        const workId = await importAo3(id, mode, database)
        setImporting(false)
        if (workId) {
            navigate(`/work/${workId}`)
        } else {
            messenger.error(t('view.storyline.import.ao3.error'))
        }
    }

    return (
        <Box className='flex flex-grow flex-col p-5'>
            <Typography className='text-center text-[#900]' variant='h6'>
                <Link href='https://archiveofourown.org/' color='inherit'>
                    {t('view.storyline.import.ao3.title')}
                </Link>
            </Typography>
            <Typography className='text-center' variant='body2'>
                <Link href='https://archiveofourown.org/' color='inherit'>
                    archiveofourown.org
                </Link>
            </Typography>
            <Box className='flex-grow p-5'>
                <FormControl>
                    <RadioGroup
                        row
                        name='mode'
                        value={mode}
                        onChange={(event) => setMode(event.target.value as ModeType)}>
                        <FormControlLabel value='work' control={<Radio />} label='Work' />
                        <FormControlLabel value='series' control={<Radio />} label='Series' />
                    </RadioGroup>
                </FormControl>
                <TextField
                    value={id || ''}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                    }}
                    type='number'
                    fullWidth
                    placeholder='e.g., 42948555'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setId(parseInt(event.target.value))
                    }}
                />
            </Box>

            {importing ? (
                <Box className='text-center'>
                    <CircularProgress size={appFontSize * 2} />
                </Box>
            ) : (
                <Button variant='contained' onClick={handleImport}>
                    {t('view.storyline.import.button')}
                </Button>
            )}
        </Box>
    )
}

export default Ao3Box
