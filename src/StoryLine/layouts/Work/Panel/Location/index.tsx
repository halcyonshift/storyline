import { useEffect, useState } from 'react'
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
import { GLOBAL_ICONS, LOCATION_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { LocationModel, WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { status } from '@sl/theme/utils'
import { NodeType, NodeGroupType } from './types'

const LocationPanel = () => {
    const [group, setGroup] = useState<boolean>(false)
    const [list, setList] = useState<LocationModel[]>([])
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()
    const { loadTab, removeTab } = useTabs()
    const locations = useObservable(
        () => work.location.extend(Q.sortBy('name', Q.asc)).observeWithColumns(['name', 'status']),
        [],
        []
    )

    useEffect(() => {
        const tree = ((data, root: string) => {
            const r: NodeType[] = [],
                o: NodeGroupType = {}
            data.forEach((a) => {
                const parentId = a.location.id || null
                o[a.id] = { data: a, children: o[a.id] && o[a.id].children }
                if (parentId === root) {
                    r.push(o[a.id])
                } else {
                    o[parentId] = o[parentId] || {}
                    o[parentId].children = o[parentId].children || []
                    o[parentId].children.push(o[a.id])
                }
            })
            return r
        })(
            locations.sort((a, b) => a.name.localeCompare(b.name)),
            null
        )
        setList(
            tree.reduce(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (function traverse(level): any {
                    return (r: LocationModel[], a: NodeType) => {
                        a.data.level = level
                        return r.concat(a.data, (a.children || []).reduce(traverse(level + 1), []))
                    }
                })(0),
                []
            )
        )
    }, [group, locations])

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
                {list
                    .filter((location) => group || !location.location.id)
                    .map((location) => (
                        <ListItem key={location.id} disablePadding disableGutters divider>
                            <ListItemText
                                primary={
                                    <Box
                                        className='flex justify-between align-middle'
                                        sx={{
                                            backgroundColor: status(location.status).color,
                                            paddingLeft: location.level
                                        }}>
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
                                                text='layout.work.panel.note.add'
                                                link={`addNote/location/${location.id}`}
                                                icon={NOTE_ICONS.add}
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
                                                confirm={t(
                                                    'layout.work.panel.location.deleteConfirm',
                                                    {
                                                        name: location.displayName
                                                    }
                                                )}
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
