import { Box, Stack } from '@mui/material'

import TooltipIconButton from '@sl/components/TooltipIconButton'

export { default as CharacterPanel } from './Character'
export { default as ItemPanel } from './Item'
export { default as LocationPanel } from './Location'
export { default as NotePanel } from './Note'
export { default as SectionPanel } from './Section'

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
                    />
                ))}
                {action ? <Box className='ml-auto'>{action}</Box> : null}
            </Stack>
            <Box className='flex-grow overflow-auto border-t-2 border-indigo-400'>{children}</Box>
        </Box>
    )
}

export default Panel
