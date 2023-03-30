import { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import { ProgressProps } from './types'
import useSettings from '@sl/theme/useSettings'

const Progress = ({ words, goal }: ProgressProps) => {
    const [percentage] = useState<number>((100 / goal) * words > 100 ? 100 : (100 / goal) * words)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [color, setColor] = useState<any>('inherit')
    const settings = useSettings()

    useEffect(() => {
        if (percentage === 100) setColor('success')
        else if (percentage >= 75) setColor('info')
        else if (percentage >= 50) setColor('warning')
        else setColor('error')
    }, [percentage])

    return words && goal ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
                title={`${words.toLocaleString(settings.language)}/${goal.toLocaleString(
                    settings.language
                )} (${percentage.toFixed(1)}%)`}>
                <Box className='w-full'>
                    <LinearProgress color={color} variant='determinate' value={percentage} />
                </Box>
            </Tooltip>
        </Box>
    ) : null
}
export default Progress
