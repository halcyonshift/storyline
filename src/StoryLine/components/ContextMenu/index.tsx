import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { ContextMenuProps } from './types'

const ContextMenu = ({ items, children }: ContextMenuProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const [anchorEl, setAncherEl] = useState<HTMLDivElement>()
    return (
        <Box
            aria-haspopup={true}
            aria-expanded={open}
            aria-controls={open ? 'context-menu' : undefined}
            onContextMenu={(e) => {
                e.preventDefault()
                setAncherEl(e.currentTarget)
                setOpen(true)
            }}>
            {children}
            <Menu id='context-menu' open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}>
                <MenuList dense>
                    {items.map((item) => (
                        <MenuItem key={item.label}>
                            {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
                            <ListItemText inset={!item.icon}>{item.label}</ListItemText>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    )
}

export default ContextMenu
