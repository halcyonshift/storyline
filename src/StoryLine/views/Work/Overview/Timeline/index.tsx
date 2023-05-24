import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { DataSet, Timeline as VisTimeline } from 'vis-timeline/standalone/esm/vis-timeline-graph2d'
import { ConnectionModel, NoteModel, SectionModel } from '@sl/db/models'
import { OverviewTimelineProps } from '../types'
import { ItemType } from './types'
import './style.css'

const Timeline = ({ work }: OverviewTimelineProps) => {
    const [groups, setGroups] = useState([])
    const [items, setItems] = useState([])
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const database = useDatabase()
    const ref = useRef<HTMLDivElement>()
    const { t } = useTranslation()

    useEffect(() => {
        void Promise.all([
            work.character.fetch(),
            work.connection.fetch(),
            work.note.fetch(),
            work.scenes.fetch()
        ]).then(([characters, connections, notes, scenes]) => {
            characters = characters.filter((character) => character.sortDate)
            connections = connections.filter((connection) => connection.sortDate)
            notes = notes.filter((note) => note.sortDate)
            scenes = scenes.filter((scene) => scene.sortDate)

            void Promise.all(
                []
                    .concat(
                        scenes.map((scene) => ({
                            id: scene.id,
                            content: scene.displayTitle,
                            editable: { updateTime: true, updateGroup: false, remove: false },
                            className: 'scene',
                            start: DateTime.fromSQL(scene.date)
                                .toISO({
                                    suppressMilliseconds: true
                                })
                                .split('+')[0],
                            group: 'scene'
                        }))
                    )
                    .concat(
                        characters.map((character) => ({
                            id: character.id,
                            className: 'character',
                            content: t('view.work.overview.timeline.character.dob', {
                                name: character.displayName
                            }),
                            editable: false,
                            start: DateTime.fromSQL(character.dateOfBirth)
                                .toISO({
                                    suppressMilliseconds: true
                                })
                                .split('+')[0],
                            group: 'character'
                        }))
                    )
                    .concat(
                        notes.map((note) => ({
                            id: note.id,
                            className: 'note',
                            content: note.displayName,
                            editable: { updateTime: true, updateGroup: false, remove: false },
                            start: DateTime.fromSQL(note.date)
                                .toISO({
                                    suppressMilliseconds: true
                                })
                                .split('+')[0],
                            group: 'note'
                        }))
                    )
                    .concat(
                        connections.map(async (connection) => {
                            const displayName = await connection.displayName()
                            return {
                                id: connection.id,
                                content: displayName,
                                className: 'connection',
                                editable: { updateTime: true, updateGroup: false, remove: false },
                                start: DateTime.fromSQL(connection.date)
                                    .toISO({
                                        suppressMilliseconds: true
                                    })
                                    .split('+')[0],
                                group: 'connection'
                            }
                        })
                    )
            ).then((_items) => {
                if (!_items.length) return
                _items = _items.sort(
                    (a, b) =>
                        DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis()
                )
                setStart(_items[0].start)
                setEnd(_items[_items.length - 1].start)
                const _groups = []
                if (characters.length)
                    _groups.push({
                        id: 'character',
                        content: t('view.work.overview.timeline.group.characters')
                    })
                if (scenes.length)
                    _groups.push({
                        id: 'scene',
                        content: t('view.work.overview.timeline.group.scenes')
                    })
                if (notes.length)
                    _groups.push({
                        id: 'note',
                        content: t('view.work.overview.timeline.group.notes')
                    })
                if (connections.length)
                    _groups.push({
                        id: 'connection',
                        content: t('view.work.overview.timeline.group.connections')
                    })
                setGroups(new DataSet(_groups))
                setItems(new DataSet(_items))
            })
        })
    }, [])

    useEffect(() => {
        if (!ref.current || !groups.length || !items.length) return
        new VisTimeline(ref.current, items, {
            height: ref.current.offsetHeight - ref.current.getBoundingClientRect().top,
            start,
            end,
            min: DateTime.fromISO(start).minus({ years: 10 }).toISO().split('+')[0],
            max: DateTime.fromISO(end).plus({ years: 10 }).toISO().split('+')[0],
            zoomMin: 1000 * 60 * 60 * 24, // 1 day
            showCurrentTime: false,
            onMove: async (item: ItemType, callback: (value: ItemType) => void) => {
                if (item.group === 'scene') {
                    const scene = await database
                        .get<SectionModel>('section')
                        .find(item.id.toString())
                    await scene.updateRecord({
                        date: DateTime.fromJSDate(item.start as Date).toSQL()
                    })
                } else if (item.group === 'note') {
                    const note = await database.get<NoteModel>('note').find(item.id.toString())
                    await note.updateRecord({
                        date: DateTime.fromJSDate(item.start as Date).toSQL()
                    })
                } else if (item.group === 'connection') {
                    const connection = await database
                        .get<ConnectionModel>('connection')
                        .find(item.id.toString())
                    await connection.updateRecord({
                        date: DateTime.fromJSDate(item.start as Date).toSQL()
                    })
                }
                return callback(item)
            }
        })
    }, [ref.current, start, end, items.length])

    return <Box className='absolute w-full h-full' ref={ref}></Box>
}

export default Timeline
