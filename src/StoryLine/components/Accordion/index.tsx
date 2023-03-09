import { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import { AccordionProps } from './types'

const Accordion = ({ title, children, className, ...props }: AccordionProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Box className={`flex ${className}`} {...props}>
                <IconButton
                    color='inherit'
                    size='small'
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls={`${title}-content`}>
                    <ArrowForwardIosSharpIcon
                        sx={{ fontSize: '0.8rem', transform: open ? 'rotate(90deg)' : '' }}
                    />
                </IconButton>
                {title}
            </Box>
            {open ? <Box id={`${title}-content`}>{children}</Box> : null}
        </>
    )
}

export default Accordion
