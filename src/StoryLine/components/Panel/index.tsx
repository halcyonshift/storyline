import { Box, Stack } from '@mui/material'

import TooltipIconButton from '@sl/components/TooltipIconButton'

import { PanelProps } from './types'

const Panel = ({ navigation, children, action }: PanelProps) => {
    return (
        <Box className='flex-grow flex flex-col'>
            <Stack direction='row' alignItems='center'>
                {navigation.map((item) => (
                    <TooltipIconButton
                        key={item.text}
                        link={item.link}
                        text={item.text}
                        icon={item.icon}
                        onClick={item.onClick}
                    />
                ))}
                {action ? <Box className='ml-auto'>{action}</Box> : null}
            </Stack>
            <Box className='flex-grow overflow-auto border-t-2'>{children}</Box>
        </Box>
    )
}

export default Panel
