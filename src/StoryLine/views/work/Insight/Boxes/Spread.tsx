/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import { SectionModel, WorkModel } from '@sl/db/models'
import { useEffect, useState } from 'react'

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

                    characters.map((character) => {
                        if (!_tags.characters[character.record.id])
                            _tags.characters[character.record.id] = {
                                character: character.record,
                                chapters: []
                            }
                        if (!_tags.characters[character.record.id].chapters.includes(chapter.id)) {
                            _tags.characters[character.record.id].chapters.push(chapter.id)
                        }
                    })

                    items.map((item) => {
                        if (!_tags.items[item.record.id])
                            _tags.items[item.record.id] = { item: item.record, chapters: [] }

                        if (!_tags.items[item.record.id].chapters.includes(chapter.id)) {
                            _tags.items[item.record.id].chapters.push(chapter.id)
                        }
                    })

                    locations.map((location) => {
                        if (!_tags.locations[location.record.id])
                            _tags.locations[location.record.id] = {
                                location: location.record,
                                chapters: []
                            }

                        if (!_tags.locations[location.record.id].chapters.includes(chapter.id)) {
                            _tags.locations[location.record.id].chapters.push(chapter.id)
                        }
                    })

                    notes.map((note) => {
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

    return (
        <TableContainer component={Paper}>
            <Table>
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
                            key={appearance.character.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>{appearance.character.displayName}</TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-emerald-100'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {tags.items.map((appearance: any) => (
                        <TableRow
                            key={appearance.item.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>{appearance.item.displayName}</TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-emerald-100'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {tags.locations.map((appearance: any) => (
                        <TableRow
                            key={appearance.location.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>{appearance.location.displayName}</TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-emerald-100'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {tags.notes.map((appearance: any) => (
                        <TableRow
                            key={appearance.note.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>{appearance.note.displayName}</TableCell>
                            {chapters.map((chapter) => (
                                <TableCell
                                    title={chapter.displayName}
                                    scope='row'
                                    className={
                                        appearance.chapters.includes(chapter.id)
                                            ? 'bg-emerald-100'
                                            : ''
                                    }></TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Spread
