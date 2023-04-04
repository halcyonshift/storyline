import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

import { Status, type StatusType } from '@sl/constants/status'
import { ColorType, ShadeType, StatusMapType } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colors: any = resolveConfig(tailwindConfig).theme.colors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const spacing: any = resolveConfig(tailwindConfig).theme.spacing

export const StatusMap: StatusMapType = {
    [Status.TODO]: 'error',
    [Status.DRAFT]: 'warning',
    [Status.REVIEW]: 'info',
    [Status.COMPLETE]: 'success',
    [Status.ARCHIVE]: 'secondary'
}

export const status = (status?: StatusType, shade?: number) => {
    if (!shade) shade = 50

    const statusList = {
        [Status.TODO]: {
            label: 'status.todo',
            color: colors.rose[shade]
        },
        [Status.DRAFT]: {
            label: 'status.draft',
            color: colors.amber[shade]
        },
        [Status.REVIEW]: {
            label: 'status.review',
            color: colors.sky[shade]
        },
        [Status.COMPLETE]: {
            label: 'status.complete',
            color: colors.emerald[shade]
        },
        [Status.ARCHIVE]: {
            label: 'status.archive',
            color: colors.slate[shade]
        }
    }

    return statusList[status]
}

export const getHex = (palette: ColorType, shade?: ShadeType): string => {
    if (['black', 'white'].includes(palette) || !shade) {
        return colors[palette === 'white' ? 'white' : 'black']
    }

    try {
        return colors[palette][shade]
    } catch {
        return colors['black']
    }
}

// https://stackoverflow.com/questions/3942878/
// how-to-decide-font-color-in-white-or-black-depending-on-background-color
export const textColor = (bgColor: string, lightColor: string, darkColor: string) => {
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
    const r = parseInt(color.substring(0, 2), 16) // hexToR
    const g = parseInt(color.substring(2, 4), 16) // hexToG
    const b = parseInt(color.substring(4, 6), 16) // hexToB
    const uicolors = [r / 255, g / 255, b / 255]
    const c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92
        }
        return Math.pow((col + 0.055) / 1.055, 2.4)
    })
    const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    return L > 0.179 ? darkColor : lightColor
}
