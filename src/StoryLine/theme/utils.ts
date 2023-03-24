import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

import { Status, type StatusType } from '@sl/constants/status'
import { ColorType, ShadeType, StatusMapType } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colors: any = resolveConfig(tailwindConfig).theme.colors

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
