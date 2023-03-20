import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection } from 'lexical'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { $isTagNode } from '../../nodes/Tag'
import { getSelectedNode } from '../../utils/getSelectedNode'

const TagPlugin = ({ isTag }: { isTag: boolean }): null => {
    const [editor] = useLexicalComposerContext()
    const { loadTab } = useTabs()

    useEffect(() => {
        if (isTag) {
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    const node = getSelectedNode(selection)
                    const parent = node.getParent()

                    const regex = /^\s*\/*\s*|\s*\/*\s*$/gm

                    if ($isTagNode(node) || $isTagNode(parent)) {
                        const tagNode = $isTagNode(parent) ? parent : node
                        const element = editor.getElementByKey(tagNode.getKey())
                        if (element.title) {
                            const linkUrl = tagNode.getURL()
                            let parts
                            try {
                                const url = new URL(linkUrl)
                                parts = url.pathname.replace(regex, '').split('/')
                            } catch {
                                parts = linkUrl.replace(regex, '').split('/')
                            }
                            loadTab({
                                id: parts[1],
                                label: parts[2],
                                link: `${parts[0]}/${parts[1]}`
                            })
                        }
                    }
                }
            })
        }
    }, [editor, isTag])

    return null
}

export default TagPlugin
