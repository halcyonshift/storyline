import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
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
                <Link href={`/work/${work.id}`}>{work.title}</Link>
            </TableCell>
            <TableCell align='center'>{words.toLocaleString(language)}</TableCell>
            <TableCell align='center' className='whitespace-nowrap'>
                {work.displayDeadline}
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
                    text={t('view.storyline.openWork.edit')}
                    onClick={() => {
                        navigate(`/work/${work.id}/edit`)
                    }}
                />
            </TableCell>
            <TableCell>
                <TooltipIconButton
                    icon={GLOBAL_ICONS.delete}
                    text={t('view.storyline.openWork.delete')}
                    onClick={() => {
                        setWork(work)
                        setOpen(true)
                    }}
                />
            </TableCell>
        </TableRow>
    )
}

const OpenWorkView = () => {
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
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align='center'>Words</TableCell>
                            <TableCell align='center'>Deadline</TableCell>
                            <TableCell align='center'>Status</TableCell>
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>
                    {t('view.storyline.openWork.delete')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {t('view.storyline.openWork.deleteConfirm')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} autoFocus>
                        {t('view.storyline.openWork.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OpenWorkView
