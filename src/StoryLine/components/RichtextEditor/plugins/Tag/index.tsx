import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_LOW } from 'lexical'
import { TOGGLE_TAG_COMMAND, TagNode, toggleTag } from './Node'

import { TagPayloadType } from './types'

const TagPlugin = (): null => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (!editor.hasNodes([TagNode])) {
            throw new Error('TagPlugin: TagNode not registered on editor')
        }
    }, [editor])

    useEffect(() => {
        return editor.registerCommand<TagPayloadType | null>(
            TOGGLE_TAG_COMMAND,
            (payload) => {
                toggleTag(payload)
                return true
            },
            COMMAND_PRIORITY_LOW
        )
    }, [editor])

    return null
}

export default TagPlugin
