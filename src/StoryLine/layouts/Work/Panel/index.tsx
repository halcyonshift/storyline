import { Box, Stack, Divider } from '@mui/material'

import TooltipIconButton from '@sl/components/TooltipIconButton'

export { default as CharacterPanel } from './Character'
export { default as ItemPanel } from './Item'
export { default as LocationPanel } from './Location'
export { default as SectionPanel } from './Section'

import { PanelProps } from './types'

const Panel = ({ navigation, children }: PanelProps) => {
    return (
        <Box className='flex-grow flex flex-col'>
            <Stack direction='row'>
                {navigation.map((item) => (
                    <TooltipIconButton
                        key={item.text}
                        link={item.link}
                        text={item.text}
                        icon={item.icon}
                    />
                ))}
            </Stack>
            <Divider />
            <Box className='flex-grow overflow-auto'>{children}</Box>
        </Box>
    )
}

export default Panel
