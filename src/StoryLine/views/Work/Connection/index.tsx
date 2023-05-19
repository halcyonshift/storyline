import { useEffect, useRef, useState } from 'react'
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
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { DataSet, DataView, Network } from 'vis-network/standalone/esm/vis-network'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import {
    CharacterModel,
    ConnectionModel,
    ItemModel,
    LocationModel,
    NoteModel,
    WorkModel
} from '@sl/db/models'
import { ConnectionDataType } from '@sl/db/models/types'
import ConnectionForm from '@sl/forms/Work/Connection'
import { getInitialValues } from '@sl/forms/Work/utils'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { getHex } from '@sl/theme/utils'
import { ObjType, NodeType, NodeTypeByID } from './types'
import useSettings from '@sl/theme/useSettings'
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
    const [connection, setConnection] = useState<ConnectionModel | null>()
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()
    const settings = useSettings()
    const connections = useObservable(
        () => work.connection.observeWithColumns(['id_a', 'id_b', 'mode', 'to', 'from', 'color']),
        [],
        []
    )

    const colors = {
        character: getHex('emerald', 300),
        item: getHex('purple', 200),
        location: getHex('amber', 200),
        note: getHex('sky', 200)
    }

    const shapes = {
        character: 'dot',
        item: 'dot',
        location: 'dot',
        note: 'dot'
    }

    const getNodes = (): DataSet => {
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        const nodes = connections.reduce((o, connection) => {
            if (!o[connection.idA]) {
                try {
                    const objects: ObjType[] = data[connection.tableA as keyof typeof data]
                    const objA = objects.find((obj: ObjType) => obj.id === connection.idA)
                    o[connection.idA] = {
                        id: connection.idA,
                        label: objA.displayName.replace(/ /g, '\n'),
                        table: connection.tableA,
                        obj: objA,
                        color: colors[connection.tableA as keyof typeof colors],
                        shape: shapes[connection.tableA as keyof typeof shapes]
                    }
                } catch {
                    //
                }
            }
            if (!o[connection.idB]) {
                try {
                    const objects: ObjType[] = data[connection.tableB as keyof typeof data]
                    const objB = objects.find((obj: ObjType) => obj.id === connection.idB)
                    o[connection.idB] = {
                        id: connection.idB,
                        label: objB.displayName.replace(' ', '\n'),
                        table: connection.tableB,
                        obj: objB,
                        color: colors[connection.tableB as keyof typeof colors],
                        shape: shapes[connection.tableB as keyof typeof shapes]
                    }
                } catch {
                    //
                }
            }

            return o
        }, {} as NodeTypeByID)

        return new DataSet(Object.values(nodes) as NodeType[])
    }

    const getEdges = (): DataSet =>
        new DataSet(
            connections.map((connection) => ({
                id: connection.id,
                from: connection.idA,
                to: connection.idB,
                relation: connection.mode,
                value: connection.to && connection.from ? 2 : 1,
                title: connection.mode,
                color: connection.color || getHex('slate', 300),
                arrows: connection.to && connection.from ? '' : connection.to ? 'to' : 'from'
            }))
        )

    useEffect(() => {
        work.character.fetch().then((characters) => setCharacters(characters))
        work.item.fetch().then((items) => setItems(items))
        work.location.fetch().then((locations) => setLocations(locations))
        work.note.fetch().then((notes) => setNotes(notes))

        setShowTabs(true)
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
        if (!ref.current || !nodesView) return
        const network = new Network(
            ref.current,
            { nodes: nodesView, edges: edgesView },
            {
                nodes: { font: { color: getHex(settings.isDark() ? 'white' : 'black') } }
            }
        )
        network.on('doubleClick', (e) => {
            if (e.nodes.length) return
            const _connection = connections.find((connection) => connection.id === e.edges[0])
            if (_connection) {
                setConnection(_connection)
                setOpen(true)
            } else {
                setConnection(null)
            }
        })
    }, [ref.current, nodesView, edgesView])

    useEffect(() => {
        if (!nodesView || !edgesView) return
        nodesView._options.filter = (node: NodeType) => !filterTable || filterTable === node.table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        edgesView._options.filter = (edge: any) => !filterMode || filterMode === edge.relation
        nodesView.refresh()
        edgesView.refresh()
    }, [filterTable, filterMode])

    return (
        <Box className='relative w-full h-full'>
            <Box className='float-right mt-3 grid grid-cols-3 gap-3 w-1/3 px-3'>
                <Box>
                    <Button
                        variant='contained'
                        startIcon={GLOBAL_ICONS.add}
                        className='z-10'
                        onClick={() => {
                            setConnection(null)
                            setOpen(true)
                        }}>
                        {t('view.work.connection.button.add')}
                    </Button>
                </Box>
                <FormControl fullWidth className='z-10'>
                    <InputLabel id='filter-table-label'>
                        {t('view.work.connection.filter.table.label')}
                    </InputLabel>
                    <Select
                        labelId='filter-table-label'
                        id='filter-table'
                        value={filterTable}
                        label={t('view.work.connection.filter.table.label')}
                        onChange={(event) => {
                            setFilterTable(event.target.value as string)
                        }}>
                        <MenuItem value=''>{t('view.work.connection.filter.table.all')}</MenuItem>
                        {filterTableOptions.map((table) => (
                            <MenuItem key={table} value={table}>
                                {t(`view.work.connection.filter.table.${table}`)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth className='z-10'>
                    <InputLabel id='filter-mode-label'>
                        {t('view.work.connection.filter.mode.label')}
                    </InputLabel>
                    <Select
                        labelId='filter-mode-label'
                        id='filter-mode'
                        value={filterMode}
                        label={t('view.work.connection.filter.mode.label')}
                        onChange={(event) => {
                            setFilterMode(event.target.value as string)
                        }}>
                        <MenuItem value=''>{t('view.work.connection.filter.mode.all')}</MenuItem>
                        {filterModeOptions.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                                {mode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box className='absolute w-full h-full' ref={ref}></Box>
            <Dialog
                fullWidth={true}
                open={open}
                onClose={() => setOpen(false)}
                PaperComponent={PaperComponent}
                aria-labelledby='draggable'>
                <DialogTitle className='cursor-move' id='draggable'></DialogTitle>
                <DialogContent>
                    <ConnectionForm
                        setOpen={setOpen}
                        connection={connection}
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