import { useEffect } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'

import { $getRoot, $insertNodes } from 'lexical'

const InitialPlugin = ({ text }: { text: string }): null => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        editor.update(() => {
            $getRoot().clear()

            if (text) {
                const parser = new DOMParser()
                const dom = parser.parseFromString(text, 'text/html')
                const nodes = $generateNodesFromDOM(editor, dom)
                $getRoot().select()
                $insertNodes(nodes)
            }
        })
    }, [text, editor])

    return null
}

export default InitialPlugin
