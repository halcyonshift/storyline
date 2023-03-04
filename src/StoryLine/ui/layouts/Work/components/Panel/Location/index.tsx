import { LOCATION_ICONS } from '../../../../../icons'
import { LocationPanelProps } from '../types'
import Panel from '../'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LocationPanel = ({ locations }: LocationPanelProps) => {
    return (
        <Panel
            navigation={[
                {
                    link: 'location/add',
                    text: 'layout.work.panel.location.add',
                    icon: LOCATION_ICONS.add
                }
            ]}
        />
    )
}

export default LocationPanel
