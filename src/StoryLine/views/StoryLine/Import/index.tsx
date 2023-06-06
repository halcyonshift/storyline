import { Box, Paper } from '@mui/material'

import * as Boxes from './Boxes'
import { ReactElement } from 'react'

const Wrapper = ({ children }: { children: ReactElement }) => (
    <Paper elevation={1} className='relative'>
        <Box className='absolute top-0 left-0 right-0 bottom-0 overflow-auto flex'>{children}</Box>
    </Paper>
)

const ImportView = () => (
    <Box className='p-4 grid grid-cols-3 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
        <Wrapper>
            <Boxes.EPub />
        </Wrapper>
        <Wrapper>
            <Boxes.Ao3 />
        </Wrapper>
        <Wrapper>
            <Boxes.Bibisco />
        </Wrapper>
    </Box>
)
export default ImportView
