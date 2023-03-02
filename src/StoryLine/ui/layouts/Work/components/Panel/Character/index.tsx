/** @format */
import { useEffect, useState } from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import GroupAddIcon from '@mui/icons-material/GroupAddOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { CharacterModel } from '../../../../../../db/models'
import { CharacterPanelProps } from '../types'

const CharacterPanel = ({ characters }: CharacterPanelProps) => {
    const [main, setMain] = useState<CharacterModel[]>([])
    const [secondary, setSecondary] = useState<CharacterModel[]>([])
    const [tertiary, setTertiary] = useState<CharacterModel[]>([])

    const { t } = useTranslation()

    useEffect(() => {
        setMain(characters.filter((character) => character.isMain))
        setSecondary(characters.filter((character) => character.isSecondary))
        setTertiary(characters.filter((character) => character.isTertiary))
    }, [characters])

    return (
        <Box className='flex-grow flex flex-col'>
            <Stack direction='row'>
                <Tooltip title={t('layout.work.panel.character.addMain')}>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.panel.character.addMain')}>
                        <PersonAddAlt1Icon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.panel.character.addSecondary')}>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.panel.character.addSecondary')}>
                        <PersonAddAltIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.panel.character.addTertiary')}>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.panel.character.addTertiary')}>
                        <GroupAddIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Divider />
            {main.length ? <Typography variant='h5'>Main</Typography> : null}
            {secondary.length ? <Typography variant='h5'>Secondary</Typography> : null}
            {tertiary.length ? <Typography variant='h5'>Tertiary</Typography> : null}
            <Box className='flex-grow overflow-auto'></Box>
        </Box>
    )
}

export default CharacterPanel
