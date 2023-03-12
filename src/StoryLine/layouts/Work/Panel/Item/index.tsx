import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { GLOBAL_ICONS, ITEM_ICONS } from '@sl/constants/icons'
import Panel from '@sl/components/Panel'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useTabs from '@sl/layouts/Work/useTabs'

import { ItemPanelProps } from '../types'

const ItemPanel = ({ items }: ItemPanelProps) => {
    const { t } = useTranslation()
    const tabs = useTabs()

    return (
        <Panel
            navigation={[
                { link: 'addItem', text: 'layout.work.panel.item.add', icon: ITEM_ICONS.add }
            ]}>
            <List dense disablePadding>
                {items.map((item) => (
                    <ListItem key={item.id} disablePadding disableGutters divider>
                        <ListItemText
                            primary={
                                <Box className='flex justify-between align-middle'>
                                    <ListItemButton
                                        onClick={() =>
                                            tabs.loadTab({
                                                id: item.id,
                                                label: item.displayName,
                                                link: `item/${item.id}`
                                            })
                                        }>
                                        <Typography
                                            variant='body1'
                                            className='whitespace-nowrap text-ellipsis
                                            overflow-hidden'>
                                            {item.displayName}
                                        </Typography>
                                    </ListItemButton>
                                    <Stack spacing={0} direction='row'>
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.item.edit'
                                            link={`item/${item.id}/edit`}
                                            icon={GLOBAL_ICONS.edit}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.item.delete'
                                            icon={GLOBAL_ICONS.delete}
                                            confirm={t('layout.work.panel.item.deleteConfirm', {
                                                name: item.displayName
                                            })}
                                            onClick={() => {
                                                tabs.removeTab(item.id)
                                                return item.delete()
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Panel>
    )
}

export default ItemPanel
