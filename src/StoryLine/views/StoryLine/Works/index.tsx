import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Link from '@sl/components/Link'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import { status } from '@sl/theme/utils'

const WorkRow = ({
    work,
    setWork,
    setOpen
}: {
    work: WorkModel
    setWork: (value: WorkModel) => void
    setOpen: (state: boolean) => void
}) => {
    const [words, setWords] = useState<number>(0)
    const [progress, setProgress] = useState<number[]>()
    const navigate = useNavigate()
    const { language } = useSettings()
    const { t } = useTranslation()

    useEffect(() => {
        work.wordCount().then((count) => setWords(count))
        work.progress().then((progress) => setProgress(progress))
    }, [])

    return (
        <TableRow key={work.id}>
            <TableCell width='100%' component='th' scope='row'>
                <Typography variant='body1'>
                    <Link href={`/work/${work.id}`}>{work.title}</Link>
                </Typography>
            </TableCell>
            <TableCell align='center'>
                <Typography variant='body1'>{words.toLocaleString(language)}</Typography>
            </TableCell>
            <TableCell align='center' className='whitespace-nowrap'>
                <Typography variant='body1'>{work.displayDeadline}</Typography>
            </TableCell>
            <TableCell align='center'>
                {progress ? (
                    <Box className='flex flex-row'>
                        <Tooltip title={t('constant.status.TODO')}>
                            <Box
                                className='h-5'
                                sx={{
                                    width: `${progress[0] * 1.5}px`,
                                    backgroundColor: status(Status.TODO, 300).color
                                }}></Box>
                        </Tooltip>
                        <Tooltip title={t('constant.status.DRAFT')}>
                            <Box
                                className='h-5'
                                sx={{
                                    width: `${progress[1] * 1.5}px`,
                                    backgroundColor: status(Status.DRAFT, 300).color
                                }}></Box>
                        </Tooltip>
                        <Tooltip title={t('constant.status.REVIEW')}>
                            <Box
                                className='h-5'
                                sx={{
                                    width: `${progress[3] * 1.5}px`,
                                    backgroundColor: status(Status.REVIEW, 300).color
                                }}></Box>
                        </Tooltip>
                        <Tooltip title={t('constant.status.COMPLETE')}>
                            <Box
                                className='h-5'
                                sx={{
                                    width: `${progress[4] * 1.5}px`,
                                    backgroundColor: status(Status.COMPLETE, 300).color
                                }}></Box>
                        </Tooltip>
                    </Box>
                ) : null}
            </TableCell>
            <TableCell>
                <TooltipIconButton
                    icon={GLOBAL_ICONS.edit}
                    text={t('view.storyline.works.edit')}
                    onClick={() => {
                        navigate(`/work/${work.id}/edit`)
                    }}
                />
            </TableCell>
            <TableCell>
                <TooltipIconButton
                    icon={GLOBAL_ICONS.delete}
                    text={t('view.storyline.works.delete')}
                    onClick={() => {
                        setWork(work)
                        setOpen(true)
                    }}
                />
            </TableCell>
        </TableRow>
    )
}

const WorksView = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [work, setWork] = useState<WorkModel>()
    const database = useDatabase()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const works = useObservable(
        () => database.get<WorkModel>('work').query(Q.sortBy('title', Q.asc)).observe(),
        [],
        []
    )

    const handleClose = () => setOpen(false)
    const handleDelete = async () => {
        await work.delete()
        setOpen(false)
        if (works.length === 1) {
            navigate('/')
        }
    }

    return (
        <>
            <Box className='p-4 bg-slate-50 h-full dark:bg-neutral-700'>
                <Paper elevation={1} className='relative'>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align='center'>
                                        {t('view.storyline.works.table.th.words')}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {t('view.storyline.works.table.th.deadline')}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {t('view.storyline.works.table.th.status')}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {works.map((work) => (
                                    <WorkRow
                                        key={work.id}
                                        work={work}
                                        setOpen={setOpen}
                                        setWork={setWork}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>
                    {t('view.storyline.works.delete')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {t('view.storyline.works.deleteConfirm')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} autoFocus>
                        {t('view.storyline.works.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default WorksView
