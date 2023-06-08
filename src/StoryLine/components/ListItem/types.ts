import { ReactElement } from 'react'
import { ListItemProps as MuiListItemProps } from '@mui/material'
import { TabType } from '@sl/layouts/Work/types'

export interface ListItemProps extends MuiListItemProps {
    link?: string
    tab?: TabType
    icon?: ReactElement
    primary: string
    secondary?: string
}
