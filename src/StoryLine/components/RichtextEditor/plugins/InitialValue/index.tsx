import { useEffect } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'

import { $getRoot, $insertNodes } from 'lexical'

const InitialPlugin = ({ text }: { text: string }) => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(text, 'text/html')

        editor.update(() => {
            const nodes = $generateNodesFromDOM(editor, dom)
            $getRoot().select()
            $insertNodes(nodes)
        })
    }, [text, editor])

    return <></>
}

export default InitialPlugin
