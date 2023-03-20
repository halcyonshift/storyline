import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { createCommand, LexicalCommand, COMMAND_PRIORITY_LOW } from 'lexical'
import { useParams } from 'react-router-dom'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { MenuProps } from '../../types'
import VersionMenu from './Menu'

export const LOAD_VERSION_COMMAND: LexicalCommand<string> = createCommand()

const VersionPlugin = (props: MenuProps) => {
    const [editor] = useLexicalComposerContext()
    const [open, setOpen] = useState<boolean>(false)
    const params = useParams()
    const { sections, loadTab } = useTabs()

    useEffect(() => setOpen(Boolean(props.menu === 'version')), [props.menu])

    useEffect(() => {
        editor.registerCommand<string>(
            LOAD_VERSION_COMMAND,
            (id) => {
                const version = sections.find((section) => section.id === id)
                const scene = sections.find((section) => section.id === params.section_id)
                loadTab({
                    id,
                    label: `${scene.displayTitle} - ${version.displayTitle}`,
                    link: `section/${id}`
                })
                return true
            },
            COMMAND_PRIORITY_LOW
        )
    }, [editor])

    return <VersionMenu open={open} {...props} />
}

export default VersionPlugin
