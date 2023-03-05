import { IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TooltipIconButtonProps } from './types'

const TooltipIconButton = ({ text, icon, link, ...props }: TooltipIconButtonProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <Tooltip title={t(text)}>
            <IconButton
                color='inherit'
                onClick={() => navigate(link)}
                aria-label={t(text)}
                {...props}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default TooltipIconButton
