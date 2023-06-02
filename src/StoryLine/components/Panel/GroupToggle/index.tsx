import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { GroupToggleProps } from './types'

const GroupToggle = ({ label, group, setGroup }: GroupToggleProps) => {
    const { t } = useTranslation()

    return (
        <Tooltip title={t(label || 'component.panel.groupToggle.default')}>
            <Switch
                id='groupSwitch'
                checked={group}
                onChange={() => setGroup(!group)}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </Tooltip>
    )
}

export default GroupToggle
