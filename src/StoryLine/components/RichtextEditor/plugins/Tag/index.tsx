import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_LOW } from 'lexical'
import { MenuProps } from '../../types'
import { TOGGLE_TAG_COMMAND, TagNode, toggleTag } from './Node'
import TagMenu from './Menu'
import { TagPayloadType } from './types'

const TagPlugin = (props: MenuProps) => {
    const [editor] = useLexicalComposerContext()
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!editor.hasNodes([TagNode])) {
            throw new Error('TagPlugin: TagNode not registered on editor')
        }
    }, [editor])

    useEffect(() => setOpen(Boolean(props.menu === 'tag')), [props.menu])

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

    return <TagMenu open={open} {...props} />
}

export default TagPlugin
