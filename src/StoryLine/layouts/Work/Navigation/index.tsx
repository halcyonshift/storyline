import { Box, Divider, IconButton, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Icons from '@sl/constants/icons'
import { NavigationProps, TogglePanelType } from '@sl/layouts/Work/Navigation/types'
import useSettings from '@sl/theme/useSettings'
import useTabs from '../Tabs/useTabs'
import useLayout from '../useLayout'

const Navigation = ({ currentPanel, setCurrentPanel, forwardRef }: NavigationProps) => {
    const { t } = useTranslation()
    const params = useParams()
    const navigate = useNavigate()
    const settings = useSettings()
    const { loadTab } = useTabs()
    const { setPanelWidth } = useLayout()

    const togglePanel = (panel?: TogglePanelType) => {
        setCurrentPanel(panel !== currentPanel ? panel : null)
        setPanelWidth(0)
    }

    return (
        <Box
            ref={forwardRef}
            id='navigation'
            sx={{ backgroundColor: settings.getHex() }}
            className='text-white flex flex-col justify-between'>
            <Stack>
                <Tooltip title={t('layout.work.navigation.work')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.work')}
                        onClick={() => togglePanel('section')}>
                        {Icons.section.section}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.character')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.character')}
                        onClick={() => togglePanel('character')}>
                        {Icons.character.character}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.location')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.location')}
                        onClick={() => togglePanel('location')}>
                        {Icons.location.location}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.item')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.item')}
                        onClick={() => togglePanel('item')}>
                        {Icons.item.item}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.note')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.note')}
                        onClick={() => togglePanel('note')}>
                        {Icons.note.note}
                    </IconButton>
                </Tooltip>
            </Stack>
            <Stack>
                <Divider className='bg-white' />
                <Tooltip title={t('layout.work.navigation.search')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.search')}
                        onClick={() => togglePanel('search')}>
                        {Icons.search.search}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.overview')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.overview')}
                        onClick={() => {
                            loadTab({
                                id: 'overview',
                                label: t('layout.work.navigation.overview'),
                                link: 'overview'
                            })
                        }}>
                        {Icons.overview.summary}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.connection')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.connection')}
                        onClick={() => {
                            loadTab({
                                id: 'connection',
                                label: t('layout.work.navigation.connection'),
                                link: 'connection'
                            })
                        }}>
                        {Icons.connection.connections}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.insight')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.insight')}
                        onClick={() => {
                            togglePanel()
                            navigate(`/work/${params.work_id}/insight`)
                        }}>
                        {Icons.insight.insights}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.backupRestore')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.backupRestore')}
                        onClick={() => {
                            togglePanel()
                            navigate(`/work/${params.work_id}/backupRestore`)
                        }}>
                        {Icons.importExport.importExport}
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('layout.work.navigation.setting')} placement='right'>
                    <IconButton
                        color='inherit'
                        aria-label={t('layout.work.navigation.setting')}
                        onClick={() => {
                            togglePanel()
                            navigate(`/work/${params.work_id}/edit`)
                        }}>
                        {Icons.settings.settings}
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    )
}

export default Navigation
