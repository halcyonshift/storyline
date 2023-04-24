import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { createCommand, LexicalCommand, COMMAND_PRIORITY_LOW } from 'lexical'
import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { MenuProps } from '../../types'
import VersionMenu from './Menu'
import { useDatabase } from '@nozbe/watermelondb/hooks'

export const LOAD_VERSION_COMMAND: LexicalCommand<string | null> = createCommand()

const VersionPlugin = (props: MenuProps) => {
    const database = useDatabase()
    const section = useRouteLoaderData('section') as SectionModel
    const [editor] = useLexicalComposerContext()
    const [open, setOpen] = useState<boolean>(false)
    const { loadTab } = useTabs()

    useEffect(() => setOpen(Boolean(props.menu === 'version')), [props.menu])

    useEffect(() => {
        editor.registerCommand<string | null>(
            LOAD_VERSION_COMMAND,
            (id) => {
                if (id) {
                    database
                        .get<SectionModel>('section')
                        .find(id)
                        .then((version) => {
                            loadTab({
                                id,
                                label: `${section.displayTitle} - ${version.displayTitle}`,
                                mode: 'section'
                            })
                        })
                } else {
                    section.addVersion().then((version) => {
                        loadTab({
                            id: version.id,
                            label: `${section.displayTitle} - ${version.displayTitle}`,
                            mode: 'section'
                        })
                    })
                }

                return true
            },
            COMMAND_PRIORITY_LOW
        )
    }, [editor])

    return <VersionMenu open={open} {...props} />
}

export default VersionPlugin
