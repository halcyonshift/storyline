import { ReactElement } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import StyleModel from '@sl/db/models/StyleModel'
import { MenuProps } from '../../types'
import { LOAD_STYLE_COMMAND } from '.'

const StyleMenu = ({ open, menuElement, setMenu, setMenuElement }: MenuProps): ReactElement => {
    const database = useDatabase()
    const [editor] = useLexicalComposerContext()
    const styles = useObservable(() => database.get<StyleModel>('style').query().observe(), [], [])
    const { t } = useTranslation()

    const handleClose = () => {
        setMenu(null)
        setMenuElement(null)
    }

    return (
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
                'aria-labelledby': `menu-style`
            }}>
            <MenuItem
                onClick={() => {
                    editor.dispatchCommand(LOAD_STYLE_COMMAND, null)
                    handleClose()
                }}>
                <Typography variant='body1'>
                    {t('component.richtextEditor.toolbar.style.addStyle')}
                </Typography>
            </MenuItem>
            {styles.map((style) => (
                <MenuItem
                    key={style.id}
                    onClick={() => {
                        handleClose()
                        editor.dispatchCommand(LOAD_STYLE_COMMAND, style.id)
                    }}>
                    <Typography variant='body1'>{style.label}</Typography>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default StyleMenu
