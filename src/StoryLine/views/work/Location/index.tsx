import { useEffect, useState } from 'react'
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import ViewWrapper from '@sl/components/ViewWrapper'
import LocationModel from '@sl/db/models/LocationModel'
import { htmlParse } from '@sl/utils'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import Map from '@sl/components/Map'

const LocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel
    const { t } = useTranslation()
    const { loadTab } = useTabs()

    const DEFAULT_TABS = [t('component.viewWrapper.tab.general')]

    const [children, setChildren] = useState<LocationModel[]>([])
    const [tabList, setTabList] = useState<string[]>(DEFAULT_TABS)

    useEffect(() => {
        location.locations.fetch().then((locations) => {
            if (locations.length) {
                setChildren(locations)
                setTabList(DEFAULT_TABS.concat([t('component.viewWrapper.tab.locations')]))
            } else {
                setChildren([])
                setTabList(DEFAULT_TABS)
            }
        })
    }, [location.id])

    return (
        <ViewWrapper tabList={tabList} model={location}>
            <Stack spacing={2} className='py-3'>
                {location.latLng ? <Map center={location.latLng}></Map> : null}
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
                                            label: child.displayName,
                                            link: `location/${child.id}`
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
