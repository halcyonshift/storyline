import { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import Box from '@mui/material/Box'

import { AccordionProps } from './types'

const Accordion = ({ id, title, children, className, ...props }: AccordionProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Box
                className={`flex items-center ${className}`}
                {...props}
                role='button'
                aria-expanded={open}
                aria-controls={`content-${id}`}
                onClick={() => setOpen(!open)}>
                <ArrowForwardIosSharpIcon
                    className='mr-1'
                    sx={{ fontSize: '0.8rem', transform: open ? 'rotate(90deg)' : '' }}
                />
                {title}
            </Box>
            {open ? <Box id={`content-${id}`}>{children}</Box> : null}
        </>
    )
}

export default Accordion
