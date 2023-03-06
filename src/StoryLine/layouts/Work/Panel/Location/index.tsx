import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import Image from '@sl/components/Image'
import { LOCATION_ICONS } from '@sl/constants/icons'
import { LocationPanelProps } from '../types'
import Panel from '../'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LocationPanel = ({ locations }: LocationPanelProps) => {
    const navigate = useNavigate()
    return (
        <Panel
            navigation={[
                {
                    link: 'addLocation',
                    text: 'layout.work.panel.location.add',
                    icon: LOCATION_ICONS.add
                }
            ]}>
            <List>
                {locations.map((location) => (
                    <>
                        <ListItem
                            alignItems='flex-start'
                            onClick={() => navigate(`location/${location.id}`)}>
                            {location.image ? (
                                <ListItemAvatar>
                                    <Image
                                        path={location.image}
                                        alt={location.displayName}
                                        width='50px'
                                        className='rounded-md'
                                    />
                                </ListItemAvatar>
                            ) : null}
                            <ListItemText
                                primary={location.displayName}
                                secondary={
                                    location.url ? (
                                        <Typography variant='body2'>{location.url}</Typography>
                                    ) : null
                                }
                            />
                        </ListItem>
                        <Divider component='li' />
                    </>
                ))}
            </List>
        </Panel>
    )
}

export default LocationPanel
