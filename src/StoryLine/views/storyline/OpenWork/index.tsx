import { useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { WorkModel } from '@sl/db/models'
import { useDatabase } from '@nozbe/watermelondb/hooks'

const OpenWorkView = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [work, setWork] = useState<WorkModel>()
    const database = useDatabase()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const works = useObservable(
        () => database.get<WorkModel>('work').query(Q.sortBy('title', Q.asc)).observe(),
        [],
        []
    )

    const handleClose = () => setOpen(false)
    const handleDelete = async () => {
        await work.delete()
        setOpen(false)
        if (works.length === 1) {
            navigate('/')
        }
    }

    return (
        <>
            <List disablePadding>
                {works.map((work) => (
                    <ListItem
                        divider
                        disableGutters
                        disablePadding
                        key={work.id}
                        secondaryAction={
                            <Box>
                                <TooltipIconButton
                                    icon={GLOBAL_ICONS.edit}
                                    text={t('view.storyline.openWork.edit')}
                                    onClick={() => {
                                        navigate(`/work/${work.id}/edit`)
                                    }}
                                />
                                <TooltipIconButton
                                    icon={GLOBAL_ICONS.delete}
                                    text={t('view.storyline.openWork.delete')}
                                    onClick={() => {
                                        setWork(work)
                                        setOpen(true)
                                    }}
                                />
                            </Box>
                        }>
                        <ListItemButton
                            onClick={() => {
                                navigate(`/work/${work.id}`)
                            }}>
                            <ListItemText>{work.title}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>
                    {t('view.storyline.openWork.delete')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {t('view.storyline.openWork.deleteConfirm')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} autoFocus>
                        {t('view.storyline.openWork.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OpenWorkView
