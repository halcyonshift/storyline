import { useEffect, useState } from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import take from 'lodash/take'
import { DateTime } from 'luxon'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import { LastUpdatedType } from '../types'
import { useTranslation } from 'react-i18next'

const LastUpdatedBox = () => {
    const [lastUpdated, setLastUpdated] = useState<LastUpdatedType[]>([])
    const settings = useSettings()
    const work = useRouteLoaderData('work') as WorkModel
    const { loadTab } = useTabs()
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        work.section.fetch()

        void Promise.all([
            work.character.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.item.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.location.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.note.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.scenes.extend(Q.sortBy('updated_at', Q.desc)).fetch()
        ]).then(([character, item, location, note, section]) => {
            const _lastUpdated: LastUpdatedType[] = []
            for (const [table, items] of Object.entries({
                character,
                item,
                location,
                note,
                section
            })) {
                items.map((item) =>
                    _lastUpdated.push({
                        id: item.id,
                        label: item.displayName,
                        link: `${table}/${item.id}${table !== 'section' ? '/edit' : ''}`,
                        date: DateTime.fromJSDate(item.updatedAt)
                    })
                )
            }
            _lastUpdated.sort((a, b) => b.date.toMillis() - a.date.toMillis())
            setLastUpdated(take(_lastUpdated, 10))
        })
    }, [])

    return (
        <List disablePadding>
            {lastUpdated.map((item, index) => (
                <ListItem
                    key={item.id}
                    divider={Boolean(index !== lastUpdated.length - 1)}
                    disablePadding
                    secondaryAction={
                        <TooltipIconButton
                            text={t('view.work.dashboard.lastUpdated.edit')}
                            icon={GLOBAL_ICONS.edit}
                            onClick={() => navigate(`/work/${work.id}/${item.link}`)}
                        />
                    }>
                    <ListItemButton
                        onClick={() =>
                            loadTab({
                                id: item.id,
                                mode: item.link.split('/')[0] as
                                    | 'character'
                                    | 'item'
                                    | 'location'
                                    | 'note'
                                    | 'section'
                            })
                        }>
                        <ListItemText
                            primary={item.label}
                            secondary={item.date
                                .setLocale(settings.language)
                                ?.toLocaleString(DateTime.DATETIME_MED)}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default LastUpdatedBox
