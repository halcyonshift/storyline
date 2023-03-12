import Switch from '@mui/material/Switch'
import { GroupToggleProps } from './types'

const GroupToggle = ({ group, setGroup }: GroupToggleProps) => (
    <Switch
        checked={group}
        onChange={() => setGroup(!group)}
        inputProps={{ 'aria-label': 'controlled' }}
    />
)

export default GroupToggle
