import { Box, Stack } from '@mui/material'

import TooltipIconButton from '@sl/components/TooltipIconButton'
import useResize from '@sl/theme/useResize'
import useSettings from '@sl/theme/useSettings'

import { PanelProps } from './types'

const Panel = ({ navigation, children, action }: PanelProps) => {
    const settings = useSettings()
    const { width, enableResize } = useResize({ minWidth: 200, offSet: 40 })

    return (
        <Box
            sx={{ backgroundColor: settings.getHex(50), width }}
            className='relative flex flex-col border-r-slate-400 border-r'>
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
            <Box
                className='absolute w-[2px] top-0 right-[-1px] bottom-0 cursor-col-resize'
                onMouseDown={enableResize}
            />
        </Box>
    )
}

export default Panel
