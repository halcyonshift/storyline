import { Box, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useSettings from '@sl/theme/useSettings'
import { status } from '@sl/theme/utils'
import { ProgressProps } from './types'

const Progress = ({ section }: ProgressProps) => {
    const settings = useSettings()
    const { t } = useTranslation()

    const getPercentage = () => {
        try {
            return (100 / section.wordGoal) * section.wordCount > 100
                ? 100
                : (100 / section.wordGoal) * section.wordCount
        } catch {
            return 0
        }
    }

    const getBackgroundColor = () => {
        if (section.isPart) return status(section.status, settings.isDark() ? 900 : 200).color
        else if (section.isChapter)
            return status(section.status, settings.isDark() ? 800 : 100).color
        return status(section.status, settings.isDark() ? 600 : 50).color
    }

    const getTooltipTitle = () => {
        if (section.daysRemaining && !section.wordGoal) {
            return `${section.wordCount.toLocaleString()}: ${t(
                'view.work.dashboard.tracker.daysRemaining',
                {
                    days: section.daysRemaining.toLocaleString()
                }
            )}`
        }

        const base = `${section.wordCount.toLocaleString()}/${section.wordGoal.toLocaleString()}`

        if (section.wordGoal && section.daysRemaining)
            return `${base}: ${t('view.work.dashboard.tracker.daysWordsRemaining', {
                days: section.daysRemaining.toLocaleString(),
                words: section.wordsPerDay.toLocaleString()
            })}`

        return base
    }

    if (section.wordGoal) {
        return (
            <Tooltip title={getTooltipTitle()}>
                <Box className='bg-slate-100 dark:bg-slate-800 relative'>
                    <Box
                        className='absolute w-full h-full border-r-2 border-white dark:border-black'
                        sx={{
                            backgroundColor: getBackgroundColor(),
                            width: `${getPercentage()}%`
                        }}></Box>
                    <Box className='flex justify-between px-2 py-1 relative z-10'>
                        <Typography
                            variant='body1'
                            className='whitespace-nowrap overflow-hidden text-ellipsis'>
                            {section.displayTitle}
                        </Typography>
                        <Typography variant='body1' className='whitespace-nowrap'>
                            {section.wordCount ? section.wordCount.toLocaleString() : 0}
                        </Typography>
                    </Box>
                </Box>
            </Tooltip>
        )
    }

    if (section.daysRemaining) {
        return (
            <Tooltip title={getTooltipTitle()}>
                <Box
                    className='flex justify-between px-2 py-1'
                    sx={{ backgroundColor: getBackgroundColor() }}>
                    <Typography
                        variant='body1'
                        className='whitespace-nowrap overflow-hidden text-ellipsis'>
                        {section.displayTitle}
                    </Typography>
                    <Typography variant='body1' className='whitespace-nowrap'>
                        {section.wordCount ? section.wordCount.toLocaleString() : 0}
                    </Typography>
                </Box>
            </Tooltip>
        )
    }

    return (
        <Box
            className='flex justify-between px-2 py-1'
            sx={{ backgroundColor: getBackgroundColor() }}>
            <Typography variant='body1' className='whitespace-nowrap overflow-hidden text-ellipsis'>
                {section.displayTitle}
            </Typography>
            <Typography variant='body1' className='whitespace-nowrap'>
                {section.wordCount ? section.wordCount.toLocaleString() : 0}
            </Typography>
        </Box>
    )
}

export default Progress
