import { useEffect } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'

import { $getRoot, $insertNodes } from 'lexical'

const InitialValuePlugin = ({ value }: { value: string }): null => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        editor.update(() => {
            $getRoot().clear()

            if (value) {
                const parser = new DOMParser()
                const dom = parser.parseFromString(value, 'text/html')
                const nodes = $generateNodesFromDOM(editor, dom)
                $getRoot().select()
                $insertNodes(nodes)
            }
        })
    }, [value, editor])

    return null
}

export default InitialValuePlugin
