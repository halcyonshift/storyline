import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    $getSelection,
    createCommand,
    LexicalCommand,
    COMMAND_PRIORITY_LOW,
    $isTextNode
} from 'lexical'

import StyleModel from '@sl/db/models/StyleModel'
import { MenuProps } from '../../types'
import StylesMenu from './Menu'
import { useDatabase } from '@nozbe/watermelondb/hooks'

export const LOAD_STYLE_COMMAND: LexicalCommand<string | null> = createCommand()

const StylesPlugin = (props: MenuProps) => {
    const database = useDatabase()
    const [editor] = useLexicalComposerContext()
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => setOpen(Boolean(props.menu === 'style')), [props.menu])

    useEffect(() => {
        editor.registerCommand<string | null>(
            LOAD_STYLE_COMMAND,
            (id) => {
                if (id) {
                    database
                        .get<StyleModel>('style')
                        .find(id)
                        .then((style) => {
                            editor.update(() => {
                                const selection = $getSelection()
                                const nodes = selection.extract()
                                // eslint-disable-next-line max-nested-callbacks
                                nodes.forEach((node) => {
                                    if ($isTextNode(node)) {
                                        node.setStyle(style.body)
                                    }
                                })
                            })
                        })
                } else {
                    editor.update(() => {
                        const selection = $getSelection()
                        const nodes = selection.extract()
                        nodes.forEach((node) => {
                            if ($isTextNode(node)) {
                                node.setStyle('')
                            }
                        })
                    })
                }

                return true
            },
            COMMAND_PRIORITY_LOW
        )
    }, [editor])

    return <StylesMenu open={open} {...props} />
}

export default StylesPlugin
