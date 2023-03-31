import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, Paper, PaperProps } from '@mui/material'
import Draggable from 'react-draggable'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network'
import ConnectionForm from '@sl/forms/Work/Connection'
import { getInitialValues } from '@sl/forms/Work/utils'
import { CharacterModel, ItemModel, LocationModel, NoteModel, WorkModel } from '@sl/db/models'
import { ConnectionDataType } from '@sl/db/models/types'

import 'vis-network/styles/vis-network.css'

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
    const connections = useObservable(
        () => work.connection.observeWithColumns(['id_a', 'id_b', 'mode']),
        [],
        []
    )

    const [characters, setCharacters] = useState<CharacterModel[]>([])
    const [items, setItems] = useState<ItemModel[]>([])
    const [locations, setLocations] = useState<LocationModel[]>([])
    const [notes, setNotes] = useState<NoteModel[]>([])

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
                    const objA = data[connection.tableA].find((obj) => obj.id === connection.idA)
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
                    const objB = data[connection.tableB].find((obj) => obj.id === connection.idB)
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

        return new DataSet(Object.values(nodes))
    }

    const getEdges = (): DataSet => {
        const edges = connections.map((connection) => ({
            from: connection.idA,
            to: connection.idB,
            relation: connection.mode,
            arrows: connection.to && connection.from ? 'to, from' : connection.to ? 'to' : 'from',
            color: { color: connection.color || 'black' }
        }))

        return new DataSet(edges)
    }
    useEffect(() => {
        work.character.fetch().then((characters) => setCharacters(characters))
        work.item.fetch().then((items) => setItems(items))
        work.location.fetch().then((locations) => setLocations(locations))
        work.note.fetch().then((notes) => setNotes(notes))
    }, [])
    useEffect(() => {
        if (!ref.current) return
        Promise.all([getNodes(), getEdges()]).then(([nodes, edges]) => {
            new Network(ref.current, { nodes, edges }, {})
        })
    }, [ref.current, connections])

    return (
        <Box className='relative w-full h-full'>
            <Box className='float-right mt-3 mr-3'>
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
