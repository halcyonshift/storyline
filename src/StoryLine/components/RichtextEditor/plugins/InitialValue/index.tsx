import { useEffect } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, $insertNodes } from 'lexical'
import { InitialValueProps } from './types'

const InitialValuePlugin = ({ forwardRef, value }: InitialValueProps): null => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        editor.update(() => {
            $getRoot().clear()

            if (value) {
                const parser = new DOMParser()
                const dom = parser.parseFromString(value, 'text/html')
                const nodes = $generateNodesFromDOM(editor, dom)
                $getRoot().select()

                try {
                    $insertNodes(nodes)
                    if (forwardRef) {
                        setTimeout(() => forwardRef.current.scrollTo(0, 0), 1)
                    }
                } catch {
                    //
                }
            }
        })
    }, [value, editor])

    return null
}

export default InitialValuePlugin
