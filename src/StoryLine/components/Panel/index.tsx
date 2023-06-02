import Box from '@mui/material/Box'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useSettings from '@sl/theme/useSettings'
import { PanelProps } from './types'
import useResize from './useResize'

const Panel = ({ navigation, children, action }: PanelProps) => {
    const settings = useSettings()
    const { width, enableResize } = useResize()

    return (
        <Box
            id='panel'
            sx={{ backgroundColor: settings.getHex(settings.isDark() ? 800 : 50), width }}
            className='flex flex-col flex-grow'>
            {navigation || action ? (
                <Box
                    className={`flex justify-between items-center ${settings.getHeaderHeight()} border-b overflow-hidden`}>
                    {navigation
                        ? navigation.map((item) => (
                              <TooltipIconButton
                                  id={`panel-action-${item.text.split('.').at(-1)}`}
                                  key={item.text}
                                  link={item.link}
                                  text={item.text}
                                  icon={item.icon}
                                  onClick={item.onClick}
                              />
                          ))
                        : null}
                    <Box className='ml-auto whitespace-nowrap'>{action}</Box>
                </Box>
            ) : null}
            <Box className='flex-grow overflow-y-auto scrollbar-hidden border-r border-dotted h-0 shadow-md'>
                {children}
            </Box>
            <Box
                className='absolute w-1 h-full right-0 cursor-col-resize'
                onMouseDown={enableResize}
            />
        </Box>
    )
}

export default Panel
