import { useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { LocationModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { status } from '@sl/theme/utils'
import { LocationTabPanelProps } from './types'

const LocationsPanel = ({ location }: LocationTabPanelProps) => {
    const [locations, setLocations] = useState<LocationModel[]>([])
    const { loadTab } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        location.locations.fetch().then((locations) => setLocations(locations))
    }, [location.id])

    return (
        <List disablePadding sx={{ marginLeft: '1px' }}>
            {locations.map((location) => (
                <ListItem
                    key={`location-${location.id}`}
                    divider
                    disablePadding
                    disableGutters
                    sx={{
                        backgroundColor: status(location.status, 50).color
                    }}
                    secondaryAction={
                        <Stack spacing={0} direction='row' className='mr-3'>
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.location.edit'
                                link={`/work/${location.work.id}/location/${location.id}/edit`}
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
                                    location.delete()
                                }}
                            />
                        </Stack>
                    }>
                    <ListItemButton
                        onClick={() => {
                            loadTab({ id: location.id, mode: 'location' })
                        }}>
                        <ListItemText primary={location.displayName} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default LocationsPanel
