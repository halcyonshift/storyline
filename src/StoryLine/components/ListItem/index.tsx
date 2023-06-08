import { default as MuiListItem } from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ListItemProps } from './types'
import useSettings from '@sl/theme/useSettings'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const ListItem = ({ link, tab, icon, primary, secondary, divider, ...props }: ListItemProps) => {
    const navigate = useNavigate()
    const settings = useSettings()
    const { loadTab } = useTabs()
    const { t } = useTranslation()

    return (
        <MuiListItem disablePadding disableGutters divider={divider} {...props}>
            <ListItemButton
                onClick={() => {
                    tab ? loadTab(tab) : navigate(link)
                }}>
                {icon ? (
                    <ListItemIcon sx={{ fontSize: settings.appFontSize * 2 }}>{icon}</ListItemIcon>
                ) : null}
                <ListItemText primary={t(primary)} secondary={t(secondary)} />
            </ListItemButton>
        </MuiListItem>
    )
}

export default ListItem
