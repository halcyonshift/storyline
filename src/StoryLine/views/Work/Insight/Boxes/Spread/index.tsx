/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import { SectionModel, WorkModel } from '@sl/db/models'
import { useEffect, useState } from 'react'
import { getHex } from '@sl/theme/utils'
import { t } from 'i18next'

const Spread = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const [chapters, setChapters] = useState<SectionModel[]>([])
    const [tags, setTags] = useState<any>({ characters: [], items: [], locations: [], notes: [] })

    useEffect(() => {
        work.chapters.fetch().then(async (chapters) => {
            const _tags: any = {
                characters: {},
                items: {},
                locations: {},
                notes: {}
            }
            for await (const chapter of chapters) {
                const scenes = await chapter.scenes.fetch()

                for await (const scene of scenes) {
                    const characters = await scene.taggedCharacters()
                    const items = await scene.taggedItems()
                    const locations = await scene.taggedLocations()
                    const notes = await scene.taggedNotes()

                    characters.forEach((character) => {
                        if (!_tags.characters[character.record.id])
                            _tags.characters[character.record.id] = {
                                character: character.record,
                                chapters: []
                            }
                        if (!_tags.characters[character.record.id].chapters.includes(chapter.id)) {
                            _tags.characters[character.record.id].chapters.push(chapter.id)
                        }
                    })

                    items.forEach((item) => {
                        if (!_tags.items[item.record.id])
                            _tags.items[item.record.id] = { item: item.record, chapters: [] }

                        if (!_tags.items[item.record.id].chapters.includes(chapter.id)) {
                            _tags.items[item.record.id].chapters.push(chapter.id)
                        }
                    })

                    locations.forEach((location) => {
                        if (!_tags.locations[location.record.id])
                            _tags.locations[location.record.id] = {
                                location: location.record,
                                chapters: []
                            }

                        if (!_tags.locations[location.record.id].chapters.includes(chapter.id)) {
                            _tags.locations[location.record.id].chapters.push(chapter.id)
                        }
                    })

                    notes.forEach((note) => {
                        if (!_tags.notes[note.record.id])
                            _tags.notes[note.record.id] = { note: note.record, chapters: [] }

                        if (!_tags.notes[note.record.id].chapters.includes(chapter.id)) {
                            _tags.notes[note.record.id].chapters.push(chapter.id)
                        }
                    })
                }
            }
            _tags.characters = Object.values(_tags.characters)
            _tags.items = Object.values(_tags.items)
            _tags.locations = Object.values(_tags.locations)
            _tags.notes = Object.values(_tags.notes)
            setChapters(chapters)
            setTags(_tags)
        })
    }, [])

    return tags.characters.length ||
        tags.items.length ||
        tags.locations.length ||
        tags.notes.length ? (
        <TableContainer component={Paper} className='h-full scrollbar-hidden'>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell variant='head'></TableCell>
                        {chapters.map((chapter) => (
                            <TableCell variant='head' key={chapter.id}>
                                #{chapter.order}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tags.characters.map((appearance: any) => (
                        <TableRow
                            key={`spread-${appearance.character.id}`}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>
                                <Typography
                                    variant='body2'
                                    className='whitespace-nowrap truncate w-40'>
                                    {appearance.character.displayName}
                                </Typography>
                            </TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    key={`character-${chapter.id}`}
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-emerald-400'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {tags.items.map((appearance: any) => (
                        <TableRow
                            key={`spread-${appearance.item.id}`}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>
                                <Typography
                                    variant='body2'
                                    className='whitespace-nowrap truncate w-40'>
                                    {appearance.item.displayName}
                                </Typography>
                            </TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    key={`item-${chapter.id}`}
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-purple-400'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {tags.locations.map((appearance: any) => (
                        <TableRow
                            key={`spread-${appearance.location.id}`}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>
                                <Typography
                                    variant='body2'
                                    className='whitespace-nowrap truncate w-40'>
                                    {appearance.location.displayName}
                                </Typography>
                            </TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    key={`location-${chapter.id}`}
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-amber-400'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {tags.notes.map((appearance: any) => (
                        <TableRow
                            key={`spread-${appearance.note.id}`}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>
                                <Typography
                                    variant='body2'
                                    className='whitespace-nowrap truncate w-40'>
                                    {appearance.note.displayName}
                                </Typography>
                            </TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    key={`note-${chapter.id}`}
                                    title={chapter.displayName}
                                    scope='row'
                                    sx={{
                                        backgroundColor: appearance.chapters.includes(chapter.id)
                                            ? appearance.note.color
                                                ? appearance.note.color
                                                : getHex('sky', 400)
                                            : 'transparent'
                                    }}></TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : (
        <Typography variant='body1' className='p-5 text-center'>
            {t('view.work.insight.spread.empty')}
        </Typography>
    )
}

export default Spread
