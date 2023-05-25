import { useEffect, useState } from 'react'
import { Box, Checkbox, CircularProgress, FormControlLabel, InputBase } from '@mui/material'
import { styled } from '@mui/material/styles'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import Panel from '@sl/components/Panel'
import WorkModel from '@sl/db/models/WorkModel'
import Result from './Result'
import useSettings from '@sl/theme/useSettings'
import { getHex } from '@sl/theme/utils'
import { htmlToText } from 'html-to-text'

const SearchInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        borderRadius: 0
    }
}))

const SearchPanel = () => {
    const [fullWord, setFullWord] = useState<boolean>(false)
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [sceneOnly, setSceneOnly] = useState<boolean>(false)
    const [keyWords, setKeyWords] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [results, setResults] = useState([])
    const { t } = useTranslation()
    const work = useRouteLoaderData('work') as WorkModel
    const { getHeaderHeight, isDark } = useSettings()

    const doSearch = debounce(async (query) => {
        query = htmlToText(query.toString())
        setKeyWords(query)
        setResults([])
        if (!query || query.length < 3 || isSearching) return
        setIsSearching(true)
        const _results = await work.search(query, sceneOnly, caseSensitive, fullWord)
        setResults(_results)
        setIsSearching(false)
    }, 1000)

    useEffect(() => {
        void doSearch(keyWords)
    }, [fullWord, caseSensitive, sceneOnly])

    return (
        <Panel>
            <Box className='flex h-full flex-col'>
                <Box className='border-b-2 bg-white'>
                    <SearchInput
                        id='search'
                        autoFocus
                        type='search'
                        placeholder={t('layout.work.panel.search.form.placeholder')}
                        onChange={(e) => doSearch(e.target.value)}
                        fullWidth
                        sx={isDark() ? { color: getHex('black') } : {}}
                        className={`border-b ${getHeaderHeight()} px-3`}
                    />
                    <Box className='grid grid-cols-1 xl:grid-cols-2 gap-0 px-2 dark:bg-slate-600'>
                        <FormControlLabel
                            className='whitespace-nowrap'
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
                            className='whitespace-nowrap'
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
                            className='whitespace-nowrap'
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
                <Box className='flex-grow h-0 overflow-auto scrollbar-hidden'>
                    {isSearching ? (
                        <Box className='p-5 text-center'>
                            <CircularProgress color='primary' />
                        </Box>
                    ) : null}
                    {results.map((result) => (
                        <Result key={result.id} result={result} />
                    ))}
                </Box>
            </Box>
        </Panel>
    )
}

export default SearchPanel
