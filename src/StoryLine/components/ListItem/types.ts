import { ReactElement } from 'react'
import { ListItemProps as MuiListItemProps } from '@mui/material'

export interface ListItemProps extends MuiListItemProps {
    link?: string
    icon?: ReactElement
    primary: string
    secondary?: string
}
