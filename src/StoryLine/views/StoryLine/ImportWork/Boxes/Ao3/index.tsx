import {
    Box,
    Button,
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
import importAo3 from './importAo3'
import { useState } from 'react'

type ModeType = 'series' | 'work'

const Ao3Box = () => {
    const [id, setId] = useState<number>()
    const [mode, setMode] = useState<ModeType>('work')
    const database = useDatabase()
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Box className='grid h-full place-items-center p-5'>
            <Typography variant='h6'>
                <Link href='https://archiveofourown.org/' color='inherit'>
                    {t('view.storyline.importWork.ao3.title')}
                </Link>
            </Typography>
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
                value={id}
                inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                }}
                type='number'
                placeholder='e.g., 42948555'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setId(parseInt(event.target.value))
                }}
            />
            <Button
                variant='contained'
                onClick={async () => {
                    const workId = await importAo3(id, database)

                    if (workId) {
                        navigate(`/work/${workId}`)
                    } else {
                        messenger.error(t('view.storyline.importWork.ao3.error'))
                    }
                }}>
                {t('view.storyline.importWork.button')}
            </Button>
        </Box>
    )
}

export default Ao3Box