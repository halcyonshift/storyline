import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'

import { SEARCH_ICONS } from '@sl/constants/icons'
import WorkModel from '@sl/db/models/WorkModel'
import { PanelType } from '../types'
import Panel from '..'

const SearchInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        borderRadius: 0,
        width: '100vw',
        padding: '10px 12px'
    }
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchPanel = ({ loadTab }: PanelType) => {
    const [fullWord, setFullWord] = useState<boolean>(false)
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [sceneOnly, setSceneOnly] = useState<boolean>(false)
    const [keyWords, setKeyWords] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [results, setResults] = useState([])
    const { t } = useTranslation()
    const work = useRouteLoaderData('work') as WorkModel

    const doSearch = debounce((query) => {
        setKeyWords(query)
        if (!query) return setResults([])
        setIsSearching(true)
        work.search(query, sceneOnly, caseSensitive, fullWord)
    }, 500)

    useEffect(() => doSearch(keyWords), [fullWord, caseSensitive, sceneOnly])

    return (
        <Panel
            navigation={[
                {
                    link: 'addNote',
                    text: 'layout.work.panel.search.clear',
                    icon: SEARCH_ICONS.clear
                }
            ]}>
            <>
                <Box className='border-b-2 bg-white'>
                    <SearchInput
                        id='search'
                        autoFocus
                        placeholder={t('layout.work.panel.search.form.placeholder')}
                        onChange={(e) => doSearch(e.target.value)}
                    />
                    <Box className='grid grid-cols-1 xl:grid-cols-2 gap-0 px-2'>
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
                <Box></Box>
            </>
        </Panel>
    )
}
export default SearchPanel
