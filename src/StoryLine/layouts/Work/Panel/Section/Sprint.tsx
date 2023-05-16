import { useEffect, useState } from 'react'
import {
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogContentText,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem
} from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import Countdown from 'react-countdown'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import { GLOBAL_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import SprintForm from '@sl/forms/Work/Sprint'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { SprintType } from './types'
import { SectionModel, SprintModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import { getHex } from '@sl/theme/utils'

const Sprint = ({ work }: SprintType) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
    const [sprint, setSprint] = useState<SprintModel>()
    const [show, setShow] = useState<boolean>(true)
    const [words, setWords] = useState<number>(0)
    const section = useRouteLoaderData('section') as SectionModel
    const sprints = useObservable(
        () => work.sprint.observeWithColumns(['start_at', 'end_at']),
        [],
        []
    )
    const settings = useSettings()
    const { t } = useTranslation()

    const handleMenuClose = () => {
        setMenuAnchorEl(null)
    }
    const handleDialogClose = () => setDialogOpen(false)

    const renderer = ({
        hours,
        minutes,
        seconds,
        completed
    }: {
        hours: number
        minutes: number
        seconds: number
        completed: boolean
    }) =>
        completed ? (
            <Button onClick={() => setSprint(undefined)}>
                <Chip label='Sprint over!' color='secondary' />
            </Button>
        ) : (
            <Button
                id='countdown-button'
                aria-controls={menuAnchorEl ? 'countdown-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={menuAnchorEl ? 'true' : undefined}
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                <Chip
                    label={`${hours}h ${minutes}m ${seconds}s`}
                    variant='filled'
                    color='primary'
                    sx={!show ? { color: settings.getHex(500) } : {}}
                />
            </Button>
        )

    useEffect(() => {
        setMenuAnchorEl(null)
        setSprint(
            sprints.find((sprint) => sprint.startAt <= new Date() && sprint.endAt >= new Date())
        )
    }, [sprints.length])

    useEffect(() => {
        if (!menuAnchorEl || !sprint) return
        sprint.wordCount().then((sprintWords) => setWords(sprintWords))
    }, [menuAnchorEl])

    useEffect(() => {
        if (!section || !sprint || !section.isScene) return
        sprint.sprint_statistic
            .extend(Q.where('section_id', section.id))
            .fetch()
            .then(async (statistics) => {
                if (!statistics.length) {
                    const words = await section.getWordCount()
                    await sprint.addStatistic({ section, words })
                }
            })
    }, [section?.id, sprint?.id])

    return sprint ? (
        <>
            <Countdown date={sprint.endAt} renderer={renderer} daysInHours={true} />
            <Menu
                id='countdown-menu'
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'countdown-button'
                }}>
                <ListItemText
                    className='text-center p-1'
                    sx={{ backgroundColor: settings.getHex(500), color: getHex('white') }}>
                    {words}
                    {sprint.wordGoal ? `/${sprint.wordGoal}` : ''}
                </ListItemText>
                <MenuItem onClick={() => setShow(!show)}>
                    <ListItemIcon>{show ? GLOBAL_ICONS.hide : GLOBAL_ICONS.show}</ListItemIcon>
                    <ListItemText>{show ? 'Hide' : 'Show'}</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => await sprint.updateRecord({ endAt: new Date() })}>
                    <ListItemIcon>{SECTION_ICONS.sprint}</ListItemIcon>
                    <ListItemText>End early</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => await sprint.delete()}>
                    <ListItemIcon>{GLOBAL_ICONS.delete}</ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    ) : (
        <>
            <TooltipIconButton
                onClick={() => setDialogOpen(true)}
                text={t('layout.work.panel.section.sprint.title')}
                icon={SECTION_ICONS.sprint}
            />
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogContent className='grid grid-cols-1 gap-5'>
                    <DialogContentText>
                        {t('layout.work.panel.section.sprint.intro')}
                    </DialogContentText>
                    <SprintForm work={work} setDialogOpen={setDialogOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Sprint
