/** @format */
import ImportExportIcon from '@mui/icons-material/ImportExport'
import GroupIcon from '@mui/icons-material/Group'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CategoryIcon from '@mui/icons-material/Category'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import InsightsIcon from '@mui/icons-material/Insights'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import SettingsIcon from '@mui/icons-material/Settings'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SearchIcon from '@mui/icons-material/Search'
import HubIcon from '@mui/icons-material/Hub'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavigationProps } from './types'

const Navigation = ({ work, currentPanel, setCurrentPanel }: NavigationProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const togglePanel = (panel: 'section' | 'location' | 'character' | 'item' | 'note') => {
        setCurrentPanel(panel !== currentPanel ? panel : null)
    }

    return (
        <Box className='bg-indigo-400 text-white flex flex-col justify-between'>
            <Stack>
                <Tooltip title={t('layout.work.navigation.work')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.work')}
                        onClick={() => togglePanel('section')}>
                        <MenuBookIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.character')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.character')}
                        onClick={() => togglePanel('character')}>
                        <GroupIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.location')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.location')}
                        onClick={() => togglePanel('location')}>
                        <LocationOnIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.item')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.item')}
                        onClick={() => togglePanel('item')}>
                        <CategoryIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.note')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.note')}
                        onClick={() => togglePanel('note')}>
                        <StickyNote2Icon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Stack>
                <Divider className='bg-white' />
                <Tooltip title={t('layout.work.navigation.search')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.search')}
                        onClick={() => {
                            togglePanel(null)
                            navigate(`/works/${work.id}/search`)
                        }}>
                        <SearchIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.timeline')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.timeline')}
                        onClick={() => {
                            togglePanel(null)
                            navigate(`/works/${work.id}/timeline`)
                        }}>
                        <FormatListBulletedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.relation')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.relation')}
                        onClick={() => {
                            togglePanel(null)
                            navigate(`/works/${work.id}/relation`)
                        }}>
                        <HubIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.insight')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.insight')}
                        onClick={() => {
                            togglePanel(null)
                            navigate(`/works/${work.id}/insight`)
                        }}>
                        <InsightsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.backupRestore')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.backupRestore')}
                        onClick={() => {
                            togglePanel(null)
                            navigate(`/works/${work.id}/backupRestore`)
                        }}>
                        <ImportExportIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.setting')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.setting')}
                        onClick={() => {
                            togglePanel(null)
                            navigate(`/works/${work.id}/setting`)
                        }}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    )
}

export default Navigation
