import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { LOCATION_ICONS } from '@sl/constants/icons'
import { LocationPanelProps } from '../types'
import Panel from '../'

const LocationPanel = ({ locations, loadTab }: LocationPanelProps) => (
    <Panel
        navigation={[
            {
                link: 'addLocation',
                text: 'layout.work.panel.location.add',
                icon: LOCATION_ICONS.add
            }
        ]}>
        <List dense disablePadding>
            {locations.map((location) => (
                <ListItem key={location.id} disablePadding disableGutters divider>
                    <ListItemButton
                        onClick={() =>
                            loadTab({
                                id: location.id,
                                label: location.displayName,
                                link: `location/${location.id}`
                            })
                        }>
                        <ListItemText
                            primary={
                                <Typography
                                    variant='body1'
                                    className='whitespace-nowrap text-ellipsis overflow-hidden'>
                                    {location.displayName}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Panel>
)

export default LocationPanel
