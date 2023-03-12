import {
    LexicalNode,
    createCommand,
    LexicalCommand,
    $isElementNode,
    $getSelection,
    $setSelection,
    ElementNode,
    EditorConfig
} from 'lexical'
import { LinkNode, SerializedLinkNode } from '@lexical/link'
import utils from '@lexical/utils'

function convertAnchorElement(domNode: Node) {
    let node = null

    if (domNode instanceof HTMLAnchorElement) {
        const href = domNode.getAttribute('href')
        if (href?.includes('doctrine.fr/l/')) {
            node = $createTagNode(href)
        }
    }

    return {
        node
    }
}

export const TOGGLE_TAG_COMMAND: LexicalCommand<string | null> = createCommand()

export class TagNode extends LinkNode {
    static getType() {
        return 'tag'
    }

    static clone(node: TagNode) {
        return new TagNode(node.__url, {}, node.__key)
    }

    createDOM(config: EditorConfig): HTMLAnchorElement {
        const element = super.createDOM(config)
        utils.addClassNamesToElement(element, 'tag text-emerald-500')
        return element
    }

    static importDOM() {
        return {
            a: () => ({
                conversion: convertAnchorElement,
                priority: 2 as const // higher than link node (ie: 1)
            })
        }
    }

    static importJSON(serializedNode: SerializedLinkNode) {
        const node = $createTagNode(serializedNode.url)
        node.setFormat(serializedNode.format)
        node.setIndent(serializedNode.indent)
        node.setDirection(serializedNode.direction)
        return node
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportJSON(): any {
        return {
            ...super.exportJSON(),
            type: this.getType()
        }
    }
}

export function $createTagNode(url: string): TagNode {
    return new TagNode(url)
}

export function $isTagNode(node: LexicalNode | null | undefined): node is TagNode {
    return node instanceof TagNode
}

export function toggleTag(url: null | string): void {
    const selection = $getSelection()

    if (selection !== null) {
        $setSelection(selection)
    }

    const sel = $getSelection()

    if (sel !== null) {
        const nodes = sel.extract()

        if (url === null) {
            // Remove LinkNodes
            nodes.forEach((node) => {
                const parent = node.getParent()

                if ($isTagNode(parent)) {
                    const children = parent.getChildren()

                    for (let i = 0; i < children.length; i++) {
                        parent.insertBefore(children[i])
                    }

                    parent.remove()
                }
            })
        } else {
            // Add or merge LinkNodes
            if (nodes.length === 1) {
                const firstNode = nodes[0]

                // if the first node is a LinkNode or if its
                // parent is a LinkNode, we update the URL.
                if ($isTagNode(firstNode)) {
                    firstNode.setURL(url)
                    return
                } else {
                    const parent = firstNode.getParent()

                    if ($isTagNode(parent)) {
                        // set parent to be the current linkNode
                        // so that other nodes in the same parent
                        // aren't handled separately below.
                        parent.setURL(url)
                        return
                    }
                }
            }

            let prevParent: ElementNode | null = null
            let linkNode: TagNode | null = null

            // eslint-disable-next-line complexity
            nodes.forEach((node) => {
                const parent = node.getParent()

                if (
                    parent === linkNode ||
                    parent === null ||
                    ($isElementNode(node) && !node.isInline())
                ) {
                    return
                }

                if ($isTagNode(parent)) {
                    linkNode = parent
                    parent.setURL(url)
                    return
                }

                if (!parent.is(prevParent)) {
                    prevParent = parent
                    linkNode = $createTagNode(url)

                    if ($isTagNode(parent)) {
                        if (node.getPreviousSibling() === null) {
                            parent.insertBefore(linkNode)
                        } else {
                            parent.insertAfter(linkNode)
                        }
                    } else {
                        node.insertBefore(linkNode)
                    }
                }

                if ($isTagNode(node)) {
                    if (node.is(linkNode)) {
                        return
                    }
                    if (linkNode !== null) {
                        const children = node.getChildren()

                        for (let i = 0; i < children.length; i++) {
                            linkNode.append(children[i])
                        }
                    }

                    node.remove()
                    return
                }

                if (linkNode !== null) {
                    linkNode.append(node)
                }
            })
        }
    }
}
