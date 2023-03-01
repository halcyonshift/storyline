/** @format */

import { default as MuiListItem } from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ListItemProps } from './types'

const ListItem = ({ link, icon, text, divider }: ListItemProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <MuiListItem disablePadding disableGutters divider={divider} onClick={() => navigate(link)}>
            <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={t(text)} />
            </ListItemButton>
        </MuiListItem>
    )
}

export default ListItem
