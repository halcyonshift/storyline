import { useEffect, useState } from 'react'
import {
    AppBar as MuiAppBar,
    Box,
    Breadcrumbs,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Link from '@sl/components/Link'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import {
    type WorkModel,
    type CharacterModel,
    type ItemModel,
    type LocationModel,
    type NoteModel,
    type SectionModel
} from '@sl/db/models'
import useTabs from '../Tabs/useTabs'
import useLayout from '../useLayout'
import useTour from '../../useTour'
import { TabType } from '../types'

const AppBar = () => {
    const [show, setShow] = useState<boolean>(false)
    const work = useRouteLoaderData('work') as WorkModel
    const navigate = useNavigate()
    const { t } = useTranslation()
    const tour = useTour()
    const { title, breadcrumbs } = useLayout()
    const { loadTab } = useTabs()
    const character = useObservable(
        () => work.character.observeWithColumns(['display_name', 'mode']),
        [],
        []
    )
    const item = useObservable(() => work.item.observeWithColumns(['name']), [], [])
    const location = useObservable(() => work.location.observeWithColumns(['name']), [], [])
    const note = useObservable(() => work.note.observeWithColumns(['title']), [], [])
    const section = useObservable(() => work.section.observeWithColumns(['title']), [], [])
    const navLocation = useLocation()

    const getLabel = (tab: TabType) => {
        const data = {
            character,
            item,
            location,
            note,
            section
        }[tab.mode] as (CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel)[]

        return data.find((obj) => obj.id === tab.id)?.displayName || ''
    }

    useEffect(() => {
        setShow(false)
        setTimeout(() => setShow(true), 10)
    }, [navLocation.pathname])

    useEffect(() => {
        setShow(Boolean(title))
    }, [title])

    return (
        <MuiAppBar position='static' color='transparent' className='z-10 border-b' elevation={0}>
            <Toolbar variant='dense'>
                <Box className='flex w-full place-items-center justify-between'>
                    <Box className='flex flex-grow place-items-center'>
                        <Tooltip title={t('navigation.back')}>
                            <IconButton
                                edge='start'
                                color='inherit'
                                aria-label={t('navigation.back')}
                                onClick={() => navigate(-1)}>
                                {GLOBAL_ICONS.back}
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label={t('navigation.tour')}
                            onClick={() => tour.start('work')}>
                            {GLOBAL_ICONS.tour}
                        </IconButton>
                        {show ? (
                            <Breadcrumbs
                                maxItems={4}
                                aria-label='breadcrumb'
                                itemsAfterCollapse={2}>
                                <Link href={`/work/${work.id}`} color='inherit'>
                                    {t('navigation.dashboard')}
                                </Link>
                                {breadcrumbs.map((breadcrumb) =>
                                    breadcrumb.tab ? (
                                        <Link
                                            key={breadcrumb.label}
                                            color='inherit'
                                            href='#'
                                            onClick={() => loadTab(breadcrumb.tab)}>
                                            {getLabel(breadcrumb.tab)}
                                        </Link>
                                    ) : (
                                        <Link
                                            key={breadcrumb.label}
                                            color='inherit'
                                            href={breadcrumb.href}>
                                            {breadcrumb.label}
                                        </Link>
                                    )
                                )}
                                <Typography variant='body1'>{title}</Typography>
                            </Breadcrumbs>
                        ) : null}
                    </Box>
                    <Typography variant='h6'>
                        <Link href='/'>{t('storyline')}</Link>
                    </Typography>
                </Box>
            </Toolbar>
        </MuiAppBar>
    )
}

export default AppBar
