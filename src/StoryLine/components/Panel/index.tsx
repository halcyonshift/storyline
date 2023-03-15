import { Box, Stack } from '@mui/material'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useSettings from '@sl/theme/useSettings'
import { PanelProps } from './types'
import useResize from './useResize'

const Panel = ({ navigation, children, action }: PanelProps) => {
    const settings = useSettings()
    const { width, enableResize } = useResize({
        minWidth: Math.round(window.innerWidth / 6),
        offSet: document.getElementById('navigation').offsetWidth,
        name: 'panelWidth'
    })

    return open ? (
        <Box
            id='panel'
            sx={{ backgroundColor: settings.getHex(50), width }}
            className='relative flex flex-col'>
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
                className=' border-r-slate-400 border-r-2 absolute w-0 top-0 right-[-1px]
                bottom-0 cursor-col-resize'
                onMouseDown={enableResize}
            />
        </Box>
    ) : null
}

export default Panel
