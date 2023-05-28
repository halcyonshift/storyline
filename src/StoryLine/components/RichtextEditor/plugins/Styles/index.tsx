import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { createCommand, LexicalCommand, COMMAND_PRIORITY_LOW } from 'lexical'
import StyleModel from '@sl/db/models/StyleModel'
import { MenuProps } from '../../types'
import VersionMenu from './Menu'
import { useDatabase } from '@nozbe/watermelondb/hooks'

export const LOAD_STYLE_COMMAND: LexicalCommand<string | null> = createCommand()

const StylesPlugin = (props: MenuProps) => {
    const database = useDatabase()
    const [editor] = useLexicalComposerContext()
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => setOpen(Boolean(props.menu === 'version')), [props.menu])

    useEffect(() => {
        editor.registerCommand<string | null>(
            LOAD_STYLE_COMMAND,
            (id) => {
                if (id) {
                    database
                        .get<StyleModel>('style')
                        .find(id)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .then((style) => {
                            // do a thing
                        })
                } else {
                    // remove a thing
                }

                return true
            },
            COMMAND_PRIORITY_LOW
        )
    }, [editor])

    return <VersionMenu open={open} {...props} />
}

export default StylesPlugin
