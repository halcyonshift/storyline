import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

import { Status, type StatusType } from '@sl/constants/status'
import { ColorType, ShadeType } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colors: any = resolveConfig(tailwindConfig).theme.colors

export const status = (status?: StatusType, shade?: number) => {
    if (!shade) shade = 50

    const statusList = {
        [Status.TODO]: {
            label: 'status.todo',
            color: colors.red[shade]
        },
        [Status.DRAFT]: {
            label: 'status.draft',
            color: colors.blue[shade]
        },
        [Status.REVIEW]: {
            label: 'status.review',
            color: colors.yellow[shade]
        },
        [Status.COMPLETE]: {
            label: 'status.complete',
            color: colors.green[shade]
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

    return colors[palette][shade]
}
