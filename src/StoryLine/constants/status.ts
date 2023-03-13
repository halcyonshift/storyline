import { useTranslation } from 'react-i18next'
import { colors } from '@sl/theme/utils'

export type StatusType = 'TODO' | 'DRAFT' | 'REVIEW' | 'COMPLETE' | 'ARCHIVE'

export const Status = Object.freeze({
    TODO: 'TODO',
    DRAFT: 'DRAFT',
    REVIEW: 'REVIEW',
    COMPLETE: 'COMPLETE',
    ARCHIVE: 'ARCHIVE'
})

export const status = (status?: StatusType) => {
    const { t } = useTranslation()

    const statusList = {
        [Status.TODO]: {
            label: t('status.todo'),
            color: colors.red
        },
        [Status.DRAFT]: {
            label: t('status.draft'),
            color: colors.blue
        },
        [Status.REVIEW]: {
            label: t('status.review'),
            color: colors.yellow
        },
        [Status.COMPLETE]: {
            label: t('status.complete'),
            color: colors.green
        },
        [Status.ARCHIVE]: {
            label: t('status.archive'),
            color: colors.slate
        }
    }

    return status ? statusList[status] : status
}
