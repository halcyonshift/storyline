import { ReactElement } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import SectionModel from '@sl/db/models/SectionModel'
import { dateFormat } from '@sl/utils'
import { MenuProps } from '../../types'
import { LOAD_VERSION_COMMAND } from '.'

const VersionMenu = ({ open, menuElement, setMenu, setMenuElement }: MenuProps): ReactElement => {
    const section = useRouteLoaderData('section') as SectionModel
    const [editor] = useLexicalComposerContext()
    const versions = useObservable(() => section.versions.observe(), [], [])
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
                'aria-labelledby': `menu-tag`
            }}>
            <MenuItem
                onClick={() => {
                    editor.dispatchCommand(LOAD_VERSION_COMMAND, null)
                    handleClose()
                }}>
                <Typography variant='body1'>
                    {t('component.richtextEditor.toolbar.version.addVersion')}
                </Typography>
            </MenuItem>
            {versions.map((version) => (
                <MenuItem
                    key={version.id}
                    onClick={() => {
                        handleClose()
                        editor.dispatchCommand(LOAD_VERSION_COMMAND, version.id)
                    }}>
                    <Box className='flex flex-col'>
                        <Typography variant='body1'>{version.displayTitle}</Typography>
                        <Typography variant='body2'>{dateFormat(version.updatedAt)}</Typography>
                    </Box>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default VersionMenu
