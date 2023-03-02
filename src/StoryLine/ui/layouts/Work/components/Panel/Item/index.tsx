/** @format */

import AddCircleIcon from '@mui/icons-material/AddCircle'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { ItemPanelProps } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ItemPanel = ({ items }: ItemPanelProps) => {
    const { t } = useTranslation()

    return (
        <Box className='flex-grow flex flex-col'>
            <Stack direction='row'>
                <Tooltip title={t('layout.work.panel.item.add')}>
                    <IconButton color='inherit' aria-label={t('layout.work.panel.item.add')}>
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Divider />

            <Box className='flex-grow overflow-auto'></Box>
        </Box>
    )
}

export default ItemPanel
