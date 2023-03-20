import { useEffect, useState, ReactElement } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { DateTime } from 'luxon'
import { useParams } from 'react-router-dom'
import SectionModel from '@sl/db/models/SectionModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { MenuProps } from '../../types'
import { LOAD_VERSION_COMMAND } from '.'

const VersionMenu = ({ open, menuElement, setMenu, setMenuElement }: MenuProps): ReactElement => {
    const [editor] = useLexicalComposerContext()
    const [versions, setVersions] = useState<SectionModel[]>([])
    const params = useParams()
    const { sections } = useTabs()

    useEffect(() => {
        const section = sections.find((section) => section.id === params.section_id)
        section.versions.fetch().then((versions) => setVersions(versions))
    }, [sections.length, params.section_id])

    return (
        <Menu
            id='menu'
            anchorEl={menuElement}
            open={Boolean(open && menuElement)}
            onClose={() => {
                setMenu(null)
                setMenuElement(null)
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            MenuListProps={{
                'aria-labelledby': `menu-tag`
            }}>
            {versions.map((version) => (
                <MenuItem
                    key={version.id}
                    onClick={() => {
                        editor.dispatchCommand(LOAD_VERSION_COMMAND, version.id)
                    }}>
                    <Box className='flex flex-col'>
                        <Typography variant='body1'>{version.displayTitle}</Typography>
                        <Typography variant='body2'>
                            {DateTime.fromJSDate(version.updatedAt).toLocaleString(
                                DateTime.DATETIME_SHORT
                            )}
                        </Typography>
                    </Box>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default VersionMenu
