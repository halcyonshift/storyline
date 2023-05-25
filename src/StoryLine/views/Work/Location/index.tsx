import { useEffect, useState } from 'react'
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import MapView from '@sl/components/MapView'
import ViewWrapper from '@sl/components/ViewWrapper'
import LocationModel from '@sl/db/models/LocationModel'
import { htmlParse } from '@sl/utils'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const LocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const { t } = useTranslation()
    const { loadTab } = useTabs()

    const DEFAULT_TABS = [t('component.viewWrapper.tab.general')]

    const [tabList, setTabList] = useState<string[]>(DEFAULT_TABS)

    const children = useObservable(
        () => location.locations.observeWithColumns(['name']),
        [],
        [location.id]
    )

    useEffect(() => {
        if (children.length) {
            setTabList(DEFAULT_TABS.concat([t('component.viewWrapper.tab.locations')]))
        } else {
            setTabList(DEFAULT_TABS)
        }
    }, [location.id, children.length])

    return (
        <ViewWrapper tabList={tabList} model={location}>
            <Stack spacing={2} className='py-3'>
                {location.latLng ? <MapView center={location.latLng} /> : null}
                {location.latLng && location.body ? <Divider /> : null}
                {htmlParse(location.body)}
            </Stack>
            {children.length ? (
                <Box padding='false'>
                    <List disablePadding>
                        {children.map((child) => (
                            <ListItem
                                key={`child-${child.id}`}
                                divider
                                disablePadding
                                disableGutters>
                                <ListItemButton
                                    onClick={() => {
                                        loadTab({
                                            id: child.id,
                                            mode: 'location'
                                        })
                                    }}>
                                    <ListItemText primary={child.displayName} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ) : null}
        </ViewWrapper>
    )
}

export default LocationView
