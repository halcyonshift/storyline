import { useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { GLOBAL_ICONS, ITEM_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { status } from '@sl/theme/utils'
import { Status } from '@sl/constants/status'

const ItemPanel = () => {
    const [group, setGroup] = useState<boolean>(false)
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()
    const { loadTab, removeTab } = useTabs()
    const items = useObservable(
        () => work.item.extend(Q.sortBy('name', Q.asc)).observeWithColumns(['name', 'status']),
        [],
        []
    )

    return (
        <Panel
            action={
                <GroupToggle
                    label={'layout.work.panel.item.groupToggle'}
                    group={group}
                    setGroup={setGroup}
                />
            }
            navigation={[
                { link: 'addItem', text: 'layout.work.panel.item.addItem', icon: ITEM_ICONS.add }
            ]}>
            <List dense disablePadding className='bg-white'>
                {items
                    .filter((item) => Boolean(group || item.status !== Status.ARCHIVE))
                    .map((item) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            disableGutters
                            divider
                            className='bg-slate-50 dark:bg-slate-600'
                            sx={{
                                borderLeft: `8px solid ${status(item.status, 500).color}`
                            }}>
                            <ListItemText
                                primary={
                                    <Box className='flex justify-between align-middle'>
                                        <ListItemButton
                                            onClick={() => loadTab({ id: item.id, mode: 'item' })}>
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
                                                text='layout.work.panel.note.addNote'
                                                link={`addNote/item/${item.id}`}
                                                icon={NOTE_ICONS.add}
                                            />
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
                                                    removeTab(item.id)
                                                    item.delete()
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
