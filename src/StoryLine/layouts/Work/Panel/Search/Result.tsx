import { useState } from 'react'
import { Box, Chip, Typography } from '@mui/material'
import useTabs from '../../Tabs/useTabs'
import { SearchResultType } from './types'

const Result = ({ result }: { result: SearchResultType }) => {
    const [show, setShow] = useState<boolean>(false)
    const { loadTab } = useTabs()

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

export default Result
