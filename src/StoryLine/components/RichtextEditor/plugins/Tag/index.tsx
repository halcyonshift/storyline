import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { COMMAND_PRIORITY_LOW, $createTextNode, $getRoot, ElementNode } from 'lexical'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { CharacterModel, ItemModel, LocationModel, NoteModel, WorkModel } from '@sl/db/models'
import { MenuProps } from '../../types'
import { TOGGLE_TAG_COMMAND, TagNode, toggleTag, $isTagNode } from './Node'
import TagMenu from './Menu'
import { TagModeType, TagPayloadType } from './types'
import { stripSlashes } from './utils'

const TagPlugin = (props: MenuProps) => {
    const work = useRouteLoaderData('work') as WorkModel
    const [editor] = useLexicalComposerContext()
    const [open, setOpen] = useState<boolean>(false)
    const characters = useObservable(
        () =>
            work.character
                .extend(Q.sortBy('display_name', Q.asc))
                .observeWithColumns(['display_name', 'mode']),
        [],
        []
    )
    const items = useObservable(
        () => work.item.extend(Q.sortBy('name', Q.asc)).observeWithColumns(['name']),
        [],
        []
    )
    const locations = useObservable(
        () => work.location.extend(Q.sortBy('name', Q.asc)).observeWithColumns(['name']),
        [],
        []
    )
    const notes = useObservable(() => work.taggableNotes.observeWithColumns(['title']), [], [])

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

    const getTag = (mode: TagModeType, id: string) => {
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        const objects: (CharacterModel | ItemModel | LocationModel | NoteModel)[] =
            data[mode as keyof typeof data]

        return objects.find((item) => item.id === id)
    }

    useEffect(() => {
        editor.update(() => {
            $getRoot()
                .getChildren()
                .forEach((child) => {
                    child.getChildren().map((node: ElementNode) => {
                        if ($isTagNode(node)) {
                            const element = editor.getElementByKey(
                                node.getKey()
                            ) as HTMLAnchorElement
                            if (element) {
                                const url = new URL(element.href)
                                const [mode, id] = stripSlashes(url.pathname).split('/')
                                const tag = getTag(mode as TagModeType, id)

                                if (tag) {
                                    element.title = tag.displayName
                                } else {
                                    node.replace($createTextNode(node.getTextContent()))
                                }
                            }
                        }
                    })
                })
        })
    }, [editor, characters, items, locations, notes])

    return (
        <TagMenu
            characters={characters}
            items={items}
            locations={locations}
            notes={notes}
            open={open}
            {...props}
        />
    )
}

export default TagPlugin
