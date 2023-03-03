import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { LocationPanelProps } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LocationPanel = ({ locations }: LocationPanelProps) => {
    const { t } = useTranslation()

    return (
        <Box className='flex-grow flex flex-col'>
            <Stack direction='row'>
                <Tooltip title={t('layout.work.panel.location.add')}>
                    <IconButton color='inherit' aria-label={t('layout.work.panel.location.add')}>
                        <AddLocationAltIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Divider />

            <Box className='flex-grow overflow-auto'></Box>
        </Box>
    )
}

export default LocationPanel
