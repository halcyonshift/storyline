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
import { GLOBAL_ICONS, LOCATION_ICONS } from '@sl/constants/icons'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const LocationPanel = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()
    const { loadTab, removeTab } = useTabs()
    const locations = useObservable(
        () => work.location.extend(Q.sortBy('name', Q.asc)).observeWithColumns(['name', 'status']),
        [],
        []
    )
    const [group, setGroup] = useState<boolean>(false)

    return (
        <Panel
            action={<GroupToggle group={group} setGroup={setGroup} />}
            navigation={[
                {
                    link: 'addLocation',
                    text: 'layout.work.panel.location.add',
                    icon: LOCATION_ICONS.add
                }
            ]}>
            <List dense disablePadding className='bg-white'>
                {locations.map((location) => (
                    <ListItem key={location.id} disablePadding disableGutters divider>
                        <ListItemText
                            primary={
                                <Box className='flex justify-between align-middle'>
                                    <ListItemButton
                                        onClick={() =>
                                            loadTab({
                                                id: location.id,
                                                label: location.displayName,
                                                link: `location/${location.id}`
                                            })
                                        }>
                                        <Typography
                                            variant='body1'
                                            className='whitespace-nowrap text-ellipsis
                                            overflow-hidden'>
                                            {location.displayName}
                                        </Typography>
                                    </ListItemButton>
                                    <Stack spacing={0} direction='row'>
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.location.add'
                                            icon={LOCATION_ICONS.add}
                                            link={`location/${location.id}/add`}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.location.edit'
                                            link={`location/${location.id}/edit`}
                                            icon={GLOBAL_ICONS.edit}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.location.delete'
                                            icon={GLOBAL_ICONS.delete}
                                            confirm={t('layout.work.panel.location.deleteConfirm', {
                                                name: location.displayName
                                            })}
                                            onClick={() => {
                                                removeTab(location.id)
                                                location.delete()
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

export default LocationPanel
