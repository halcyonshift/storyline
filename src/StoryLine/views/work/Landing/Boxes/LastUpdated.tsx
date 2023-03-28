import { useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { take } from 'lodash'
import { DateTime } from 'luxon'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import { LastUpdatedType } from './types'

const LastUpdatedBox = () => {
    const [lastUpdated, setLastUpdated] = useState<LastUpdatedType[]>([])
    const settings = useSettings()
    const work = useRouteLoaderData('work') as WorkModel
    const { loadTab } = useTabs()

    useEffect(() => {
        work.section.fetch()

        Promise.all([
            work.character.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.item.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.location.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.note.extend(Q.sortBy('updated_at', Q.desc)).fetch(),
            work.section.extend(Q.sortBy('updated_at', Q.desc)).fetch()
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
                        link: `${table}/${item.id}`,
                        date: DateTime.fromJSDate(item.updatedAt)
                    })
                )
            }
            setLastUpdated(
                take(
                    _lastUpdated.sort((a, b) => b.date.toMillis() - a.date.toMillis()),
                    10
                )
            )
        })
    }, [])

    return (
        <List disablePadding>
            {lastUpdated.map((item, index) => (
                <ListItem divider={Boolean(index !== lastUpdated.length - 1)} disablePadding>
                    <ListItemButton onClick={() => loadTab(item)}>
                        <ListItemText
                            primary={item.label}
                            secondary={item.date
                                .setLocale(settings.language)
                                .toLocaleString(DateTime.DATETIME_MED)}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default LastUpdatedBox
