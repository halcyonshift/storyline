import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { $getRoot, TextNode } from 'lexical'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'

import { ResultType } from './types'

const Search = ({ open }: { open: boolean }) => {
    const [fullWord, setFullWord] = useState<boolean>(false)
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [keyWords, setKeyWords] = useState<string>('')
    const [results, setResults] = useState<ResultType[]>([])
    const [resultIndex, setResultIndex] = useState<number | null>(null)

    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()

    useEffect(() => {
        editor.registerRootListener((rootElement, prevRootElement) => {
            rootElement?.addEventListener('click', () => setResultIndex(null))
            prevRootElement?.removeEventListener('click', () => setResultIndex(null))
        })
    }, [editor])

    useEffect(() => {
        setResults([])

        if (!keyWords) return

        editor.update(() => {
            const children = $getRoot().getChildren()
            const _results: ResultType[] = []
            for (const child of children) {
                child.getChildren().map((node: TextNode) => {
                    const matches = node.getTextContent().matchAll(regex())
                    for (const match of matches) {
                        _results.push({ node, match })
                    }
                })
            }
            setResults(_results)
        })
    }, [editor, keyWords, fullWord, caseSensitive])

    useEffect(() => doSearch(keyWords), [fullWord, caseSensitive])

    useEffect(() => {
        setResultIndex(null)
        if (results.length) navigate('next')
    }, [results])

    const doSearch = debounce((query) => setKeyWords(query), 500)

    const regex = (): RegExp =>
        new RegExp(fullWord ? `\\b${keyWords}\\b` : keyWords, caseSensitive ? 'g' : 'gi')

    const navigate = (mode: 'back' | 'next'): void => {
        let i: number

        if (mode === 'back') {
            i = resultIndex - 1 < 0 || resultIndex === null ? results.length - 1 : resultIndex - 1
        } else {
            i = resultIndex + 1 === results.length || resultIndex === null ? 0 : resultIndex + 1
        }

        editor.update(() => {
            const result = results[i]
            result.node.select(result.match.index, result.match.index + keyWords.length)
            editor.getElementByKey(result.node.getKey()).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
            setResultIndex(i)
        })
    }

    return open ? (
        <Box className='rounded p-2 shadow-md'>
            <Box className='flex'>
                <Box className='flex-grow'>
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
                </Box>
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
                {results.length ? (
                    <Box className='flex'>
                        <Typography variant='body1' className='flex-grow self-center'>
                            {resultIndex === null ? 0 : resultIndex + 1}/{results.length}
                        </Typography>
                        <IconButton size='small' onClick={() => navigate('back')}>
                            <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton size='small' onClick={() => navigate('next')}>
                            <ArrowDownwardIcon />
                        </IconButton>
                    </Box>
                ) : null}
            </Box>
        </Box>
    ) : (
        <></>
    )
}

export default Search
