import { useEffect, useState } from 'react'
import {
    Box,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    InputBase,
    Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import Panel from '@sl/components/Panel'
import { SEARCH_ICONS } from '@sl/constants/icons'
import WorkModel from '@sl/db/models/WorkModel'
import useTabs from '../../Tabs/useTabs'

import { SearchResultType } from './types'

const SearchInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        borderRadius: 0,
        width: '100vw',
        padding: '10px 12px' // ToDo get proper spacing
    }
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchPanel = () => {
    const [fullWord, setFullWord] = useState<boolean>(false)
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [sceneOnly, setSceneOnly] = useState<boolean>(false)
    const [keyWords, setKeyWords] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [results, setResults] = useState([])
    const { t } = useTranslation()
    const work = useRouteLoaderData('work') as WorkModel
    const { loadTab } = useTabs()

    const doSearch = debounce(async (query) => {
        query = query.replace(/(<([^>]+)>)/gi, '')
        setKeyWords(query)
        setResults([])
        if (!query || query.length < 4 || isSearching) return
        setIsSearching(true)
        const _results = await work.search(query, sceneOnly, caseSensitive, fullWord)
        setResults(_results)
        setIsSearching(false)
    }, 1000)

    useEffect(() => {
        doSearch(keyWords)
    }, [fullWord, caseSensitive, sceneOnly])

    const Result = ({ result }: { result: SearchResultType }) => {
        const [show, setShow] = useState<boolean>(false)
        return (
            <>
                <Box className='flex justify-between px-2 py-1' onClick={() => setShow(!show)}>
                    <Typography
                        variant='body1'
                        className='whitespace-nowrap overflow-hidden text-ellipsis
                        pr-2'>
                        {result.label}
                    </Typography>
                    <Chip color='primary' size='small' label={result.excerpts.length} />
                </Box>
                {show ? (
                    <Box className='pl-5 pr-2'>
                        {result.excerpts.map((excerpt: string) => (
                            <Typography variant='body2' onClick={() => loadTab(result)}>
                                {excerpt}
                            </Typography>
                        ))}
                    </Box>
                ) : null}
            </>
        )
    }

    return (
        <Panel
            navigation={[
                {
                    link: 'addNote',
                    text: 'layout.work.panel.search.clear',
                    icon: SEARCH_ICONS.clear
                }
            ]}>
            <Box className='flex h-full flex-col'>
                <Box className='border-b-2 bg-white'>
                    <SearchInput
                        id='search'
                        autoFocus
                        placeholder={t('layout.work.panel.search.form.placeholder')}
                        onChange={(e) => doSearch(e.target.value)}
                    />
                    <Box className='grid grid-cols-1 xl:grid-cols-2 gap-0 px-2'>
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
