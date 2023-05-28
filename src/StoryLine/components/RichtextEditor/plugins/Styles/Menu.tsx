import { useState, ReactElement } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import * as yup from 'yup'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import StyleModel from '@sl/db/models/StyleModel'
import { MenuProps } from '../../types'
import { StyleDataType } from './types'
import { LOAD_STYLE_COMMAND } from '.'

const StyleMenu = ({ open, menuElement, setMenu, setMenuElement }: MenuProps): ReactElement => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const database = useDatabase()
    const [editor] = useLexicalComposerContext()
    const styles = useObservable(
        () => database.get<StyleModel>('style').query().observeWithColumns(['label', 'style']),
        [],
        []
    )
    const { t } = useTranslation()

    const handleClose = () => {
        setMenu(null)
        setMenuElement(null)
    }

    const handleDialogClose = () => setDialogOpen(false)

    const validationSchema = yup.object({
        label: yup.string().required(),
        body: yup.string().required()
    })

    const form: FormikProps<StyleDataType> = useFormik<StyleDataType>({
        enableReinitialize: true,
        initialValues: { label: '', body: '' },
        validationSchema,
        onSubmit: async (values: StyleDataType) => {
            await database.write(async () => {
                return await database.get<StyleModel>('style').create((style) => {
                    style.label = values.label
                    style.body = values.body
                })
            })
            setDialogOpen(false)
        }
    })

    return (
        <>
            <Menu
                id='menu'
                anchorEl={menuElement}
                open={Boolean(open && menuElement)}
                onClose={handleClose}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                MenuListProps={{
                    'aria-labelledby': 'menu-style'
                }}>
                <MenuItem
                    onClick={() => {
                        setDialogOpen(true)
                        editor.dispatchCommand(LOAD_STYLE_COMMAND, null)
                        handleClose()
                    }}>
                    <ListItemIcon>{GLOBAL_ICONS.add}</ListItemIcon>
                    <Typography variant='body1'>
                        {t('component.richtextEditor.toolbar.style.addStyle')}
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setDialogOpen(true)
                        editor.dispatchCommand(LOAD_STYLE_COMMAND, null)
                        handleClose()
                    }}>
                    <ListItemIcon>{GLOBAL_ICONS.close}</ListItemIcon>
                    <Typography variant='body1'>
                        {t('component.richtextEditor.toolbar.style.clearStyle')}
                    </Typography>
                </MenuItem>
                <Divider />
                {styles.map((style) => (
                    <MenuItem
                        key={style.id}
                        onClick={() => {
                            handleClose()
                            editor.dispatchCommand(LOAD_STYLE_COMMAND, style.id)
                        }}>
                        <ListItemText className='pr-3'>{style.label}</ListItemText>
                        <Typography
                            variant='body2'
                            color='text.secondary'
                            onClick={(e) => {
                                e.stopPropagation()
                                style.delete()
                            }}>
                            {GLOBAL_ICONS.delete}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <Box component='form' onSubmit={form.handleSubmit}>
                    <DialogTitle>
                        {t('component.richtextEditor.toolbar.style.form.title')}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('component.richtextEditor.toolbar.style.form.text')}
                        </DialogContentText>
                        <Stack spacing={3} marginTop={2}>
                            <TextField
                                id='label'
                                name='label'
                                placeholder={t('component.richtextEditor.toolbar.style.form.label')}
                                type='text'
                                fullWidth
                                variant='standard'
                                value={form.values.label}
                                onChange={form.handleChange}
                                error={form.touched.label && Boolean(form.errors.label)}
                                helperText={form.touched.label && form.errors.label}
                            />
                            <TextField
                                id='body'
                                name='body'
                                multiline
                                placeholder='text-align: right; margin-bottom: 10px'
                                type='text'
                                fullWidth
                                variant='standard'
                                value={form.values.body}
                                onChange={form.handleChange}
                                error={form.touched.body && Boolean(form.errors.body)}
                                helperText={form.touched.body && form.errors.body}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='text' onClick={handleDialogClose}>
                            {t('component.richtextEditor.toolbar.style.form.button.cancel')}
                        </Button>
                        <Button variant='contained' type='submit'>
                            {t('component.richtextEditor.toolbar.style.form.button.save')}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}

export default StyleMenu
