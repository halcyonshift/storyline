import {
    AppBar as MuiAppBar,
    Box,
    Breadcrumbs,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Link from '@sl/components/Link'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { type WorkModel } from '@sl/db/models'
import useTabs from '../Tabs/useTabs'
import useLayout from '../useLayout'
import useTour from '../../useTour'

const AppBar = () => {
    const database = useDatabase()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const params = useParams()
    const work = useObservable(
        () => database.get<WorkModel>('work').findAndObserve(params.work_id),
        useLoaderData() as WorkModel,
        []
    )
    const tour = useTour()
    const { title, breadcrumbs } = useLayout()
    const { loadTab } = useTabs()

    return (
        <MuiAppBar position='static' color='transparent' className='z-10 border-b' elevation={0}>
            <Toolbar variant='dense'>
                <Box className='flex w-full place-items-center justify-between'>
                    <Box className='flex flex-grow place-items-center'>
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label={t('navigation.back')}
                            onClick={() => navigate(-1)}>
                            {GLOBAL_ICONS.back}
                        </IconButton>
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label={t('navigation.tour')}
                            onClick={() => tour.start('work')}>
                            {GLOBAL_ICONS.tour}
                        </IconButton>
                        {title ? (
                            <Breadcrumbs maxItems={3} aria-label='breadcrumb'>
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
                                            {breadcrumb.label}
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
                                <Typography color='text.primary'>{title}</Typography>
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
