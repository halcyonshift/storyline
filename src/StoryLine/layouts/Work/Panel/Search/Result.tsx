import { useState } from 'react'
import { Box, Chip, Typography } from '@mui/material'
import useTabs from '../../Tabs/useTabs'
import { SearchResultType } from './types'

const Result = ({ result }: { result: SearchResultType }) => {
    const [show, setShow] = useState<boolean>(false)
    const { loadTab } = useTabs()

    const mode = result.link.split('/')[0] as 'character' | 'item' | 'location' | 'note' | 'section'

    return mode === 'section' ? (
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
                    {result.excerpts.map((excerpt: string, index: number) => (
                        <Typography
                            key={`result-${index}`}
                            variant='body2'
                            onClick={() =>
                                loadTab({
                                    id: result.id,
                                    mode,
                                    link: `${result.link}/${index}`
                                })
                            }>
                            {excerpt}
                        </Typography>
                    ))}
                </Box>
            ) : null}
        </>
    ) : (
        <Box
            className='flex justify-between px-2 py-1'
            onClick={() =>
                loadTab({
                    id: result.id,
                    mode,
                    link: `${result.link}/edit`
                })
            }>
            <Typography
                variant='body1'
                className='whitespace-nowrap overflow-hidden text-ellipsis
                    pr-2'>
                {result.label}
            </Typography>
        </Box>
    )
}

export default Result
