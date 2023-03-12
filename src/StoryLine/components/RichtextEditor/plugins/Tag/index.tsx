import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_EDITOR } from 'lexical'
import { TOGGLE_TAG_COMMAND, TagNode, toggleTag } from '../../nodes/Tag'

const TagPlugin = (): null => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (!editor.hasNodes([TagNode])) {
            throw new Error('TagPlugin: TagNode not registered on editor')
        }
    }, [editor])

    useEffect(() => {
        return editor.registerCommand<string | null>(
            TOGGLE_TAG_COMMAND,
            (url) => {
                toggleTag(url)
                return true
            },
            COMMAND_PRIORITY_EDITOR
        )
    }, [editor])

    return null
}

export default TagPlugin
