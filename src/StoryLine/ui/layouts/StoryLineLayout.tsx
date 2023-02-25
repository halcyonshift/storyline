import React from 'react'

import Container from '@mui/material/Container'
import { Outlet } from 'react-router-dom'


const StoryLineLayout = () => (
    <Container className='flex flex-col h-[100vh] justify-center'>
        <Outlet />
    </Container>
)

export default StoryLineLayout