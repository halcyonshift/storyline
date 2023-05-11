import { useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Tooltip
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TooltipIconButtonProps } from './types'

const TooltipIconButton = ({
    text,
    icon,
    link,
    onClick,
    confirm,
    ...props
}: TooltipIconButtonProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [open, setOpen] = useState<boolean>(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAction = async (e: any) => {
        if (onClick) await onClick(e)
        if (link) navigate(link)
        setOpen(false)
    }

    return (
        <>
            <Tooltip title={t(text)}>
                <IconButton
                    color='inherit'
                    onClick={async (e) => {
                        if (confirm) {
                            return setOpen(true)
                        }
                        handleAction(e)
                    }}
                    aria-label={t(text)}
                    {...props}>
                    {icon}
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-describedby='alert-dialog-description'>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>{confirm}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        {t('component.tooltipIconButton.dialog.no')}
                    </Button>
                    <Button color='error' onClick={handleAction} autoFocus>
                        {t('component.tooltipIconButton.dialog.yes')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TooltipIconButton
