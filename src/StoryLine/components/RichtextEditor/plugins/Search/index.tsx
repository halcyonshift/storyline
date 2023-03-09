import { useEffect, useState } from 'react'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
    $getRoot,
    $isElementNode,
    $isDecoratorNode,
    $createTextNode,
    $createRangeSelection,
    $setSelection,
    $isParagraphNode,
    ParagraphNode,
    TextNode
} from 'lexical'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'

const Search = () => {
    const [fullWord, setFullWord] = useState<boolean>(false)
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [sceneOnly, setSceneOnly] = useState<boolean>(false)
    const [keyWords, setKeyWords] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [results, setResults] = useState<any[]>([])

    const { t } = useTranslation()
    const [editor] = useLexicalComposerContext()

    const doSearch = debounce((query) => setKeyWords(query), 500)
    /*
    useEffect(
        () =>
            mergeRegister(
                editor.registerNodeTransform(TextNode, (node) => {
                    if (!keyWords) return
                    const regex = new RegExp(
                        fullWord ? `\\b${keyWords}\\b` : keyWords,
                        caseSensitive ? 'g' : 'gi'
                    )
                    const text = node.getTextContent()
                    const matches = text.matchAll(regex)

                    console.log(node)

                    node.select()



                    for (const match of matches) {
                        const selection = $createRangeSelection()
                        selection.anchor.offset = match.index
                        selection.focus.offset = match.index + keyWords.length
                        selection.focus.key = node.getKey()
                        $setSelection(selection)
                    }

                })
            ),
        [editor, keyWords]
    )
    */

    useEffect(() => {
        editor.update(() => {
            editor.registerNodeTransform(TextNode, (node) => {
                if (!keyWords) return
                const regex = new RegExp(
                    fullWord ? `\\b${keyWords}\\b` : keyWords,
                    caseSensitive ? 'g' : 'gi'
                )
                const text = node.getTextContent()
                const matches = text.matchAll(regex)

                // console.log(node)

                for (const match of matches) {
                    const selection = $createRangeSelection()
                    selection.anchor.offset = match.index
                    selection.focus.offset = match.index + keyWords.length
                    selection.focus.key = node.getKey()
                    $setSelection(selection)
                }
            })
        })
    }, [keyWords])

    useEffect(() => doSearch(keyWords), [fullWord, caseSensitive, sceneOnly])

    return (
        <Box className='rounded p-2 shadow-md'>
            <TextField
                autoFocus
                margin='dense'
                id='search'
                placeholder={t('component.richtextEditor.search.placeholder')}
                name='search'
                fullWidth
                variant='standard'
                onChange={(e) => doSearch(e.target.value)}
            />
            <Typography variant='body1'>0/{results.length}</Typography>
            <Box className='grid grid-cols-3 gap-0 px-2'>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={fullWord}
                            onChange={() => setFullWord(!fullWord)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label={t('layout.work.panel.search.form.fullWord')}
                    labelPlacement='end'
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={caseSensitive}
                            onChange={() => setCaseSensitive(!caseSensitive)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label={t('layout.work.panel.search.form.caseSensitive')}
                    labelPlacement='end'
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={sceneOnly}
                            onChange={() => setSceneOnly(!sceneOnly)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label={t('layout.work.panel.search.form.sceneOnly')}
                    labelPlacement='end'
                />
            </Box>
        </Box>
    )
}

export default Search
