import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    PaperProps,
    Select
} from '@mui/material'
import Draggable from 'react-draggable'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { DataSet, DataView, Network } from 'vis-network/standalone/esm/vis-network'
import ConnectionForm from '@sl/forms/Work/Connection'
import { getInitialValues } from '@sl/forms/Work/utils'
import { CharacterModel, ItemModel, LocationModel, NoteModel, WorkModel } from '@sl/db/models'
import { ConnectionDataType } from '@sl/db/models/types'

import 'vis-network/styles/vis-network.css'
import { useTranslation } from 'react-i18next'

const PaperComponent = (props: PaperProps) => {
    return (
        <Draggable handle='#draggable' cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    )
}

const ConnectionView = () => {
    const ref = useRef<HTMLDivElement>()
    const [open, setOpen] = useState<boolean>(false)
    const initialValues = getInitialValues('connection', ['work_id']) as ConnectionDataType
    const work = useRouteLoaderData('work') as WorkModel
    const [characters, setCharacters] = useState<CharacterModel[]>([])
    const [items, setItems] = useState<ItemModel[]>([])
    const [locations, setLocations] = useState<LocationModel[]>([])
    const [notes, setNotes] = useState<NoteModel[]>([])
    const [filterModeOptions, setFilterModeOptions] = useState<string[]>([])
    const [filterMode, setFilterMode] = useState<string>('')
    const [filterTableOptions] = useState<string[]>(['character', 'item', 'location', 'note'])
    const [filterTable, setFilterTable] = useState<string>('')
    const [nodesView, setNodesView] = useState<DataView>()
    const [edgesView, setEdgesView] = useState<DataView>()
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const { t } = useTranslation()
    const connections = useObservable(
        () => work.connection.observeWithColumns(['id_a', 'id_b', 'mode']),
        [],
        []
    )

    const getNodes = (): DataSet => {
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        return new DataSet(
            Object.values(
                connections.reduce((o, connection) => {
                    if (!o[connection.idA]) {
                        try {
                            const objA = data[connection.tableA].find(
                                (obj) => obj.id === connection.idA
                            )
                            o[connection.idA] = {
                                id: connection.idA,
                                label: objA.displayName,
                                table: connection.tableA,
                                obj: objA
                            }
                        } catch {
                            //
                        }
                    }
                    if (!o[connection.idB]) {
                        try {
                            const objB = data[connection.tableB].find(
                                (obj) => obj.id === connection.idB
                            )
                            o[connection.idB] = {
                                id: connection.idB,
                                label: objB.displayName,
                                table: connection.tableB,
                                obj: objB
                            }
                        } catch {
                            //
                        }
                    }

                    return o
                }, {})
            )
        )
    }

    const getEdges = (): DataSet =>
        new DataSet(
            connections.map((connection) => ({
                from: connection.idA,
                to: connection.idB,
                relation: connection.mode,
                arrows:
                    connection.to && connection.from ? 'to, from' : connection.to ? 'to' : 'from',
                color: { color: connection.color || 'black' }
            }))
        )

    useEffect(() => {
        work.character.fetch().then((characters) => setCharacters(characters))
        work.item.fetch().then((items) => setItems(items))
        work.location.fetch().then((locations) => setLocations(locations))
        work.note.fetch().then((notes) => setNotes(notes))
    }, [])

    useEffect(() => {
        if (!connections.length) return
        setFilterModeOptions(
            [
                ...new Set(
                    connections
                        .filter((connection) => connection.mode)
                        .map((connection) => connection.mode)
                )
            ].sort()
        )
        setNodes(getNodes())
        setEdges(getEdges())
    }, [connections])

    useEffect(() => {
        setNodesView(new DataView(getNodes()))
    }, [nodes])

    useEffect(() => {
        setEdgesView(new DataView(getEdges()))
    }, [edges])

    useEffect(() => {
        if (!ref.current) return
        new Network(ref.current, { nodes: nodesView, edges: edgesView }, {})
    }, [ref.current, nodesView, edgesView])

    useEffect(() => {
        if (!nodesView || !edgesView) return
        nodesView._options.filter = (node) => !filterTable || filterTable === node.table
        edgesView._options.filter = (edge) => !filterMode || filterMode === edge.relation
        nodesView.refresh()
        edgesView.refresh()
    }, [filterTable, filterMode])

    return (
        <Box className='relative w-full h-full'>
            <Box className='float-right mt-3 mr-3 grid grid-cols-2 gap-3'>
                <FormControl fullWidth className='z-10'>
                    <InputLabel id='filter-table-label'>
                        {t('view.work.connection.filter.table')}
                    </InputLabel>
                    <Select
                        labelId='filter-table-label'
                        id='filter-table'
                        value={filterTable}
                        label={t('view.work.connection.filter.table')}
                        onChange={(event) => {
                            setFilterTable(event.target.value as string)
                        }}>
                        <MenuItem value=''>{t('view.work.connection.filter.table')}</MenuItem>
                        {filterTableOptions.map((table) => (
                            <MenuItem key={table} value={table}>
                                {table}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth className='z-10'>
                    <InputLabel id='filter-mode-label'>
                        {t('view.work.connection.filter.mode')}
                    </InputLabel>
                    <Select
                        labelId='filter-mode-label'
                        id='filter-mode'
                        value={filterMode}
                        label={t('view.work.connection.filter.mode')}
                        onChange={(event) => {
                            setFilterMode(event.target.value as string)
                        }}>
                        <MenuItem value=''>{t('view.work.connection.filter.mode')}</MenuItem>
                        {filterModeOptions.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                                {mode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant='contained' className='z-10' onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>
            <Box className='absolute w-full h-full ' ref={ref}></Box>
            <Dialog
                fullWidth={true}
                open={open}
                onClose={() => setOpen(false)}
                PaperComponent={PaperComponent}
                aria-labelledby='draggable'>
                <DialogTitle className='cursor-move' id='draggable'></DialogTitle>
                <DialogContent>
                    <ConnectionForm
                        work={work}
                        initialValues={{
                            ...initialValues,
                            ...{ tableA: 'character', tableB: 'character' }
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ConnectionView
