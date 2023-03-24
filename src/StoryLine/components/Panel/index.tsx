import { Box, Stack } from '@mui/material'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useSettings from '@sl/theme/useSettings'
import { PanelProps } from './types'
import useResize from './useResize'

const Panel = ({ navigation, children, action }: PanelProps) => {
    const settings = useSettings()
    const { width, enableResize } = useResize()

    return (
        <Box
            sx={{ backgroundColor: settings.getHex(50), width }}
            className='flex flex-col flex-grow h-1'>
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
            <Box className='flex-grow overflow-y-auto scrollbar-hidden border-t-2'>{children}</Box>
            <Box
                className=' border-r-slate-400 border-r-2 absolute w-0 top-0 right-[-1px]
        bottom-0 cursor-col-resize'
                onMouseDown={enableResize}
            />
        </Box>
    )
}

export default Panel
