import {
    Box,
    List,
    ListItem as MuiListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography
} from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { sample } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import ListItem from '@sl/components/ListItem'
import Icons, { GLOBAL_ICONS } from '@sl/constants/icons'
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'

const LandingView = () => {
    const database = useDatabase()
    const navigate = useNavigate()
    const settings = useSettings()
    const { t } = useTranslation()
    const recentWorks = useObservable(
        () =>
            database
                .get<WorkModel>('work')
                .query(Q.sortBy('last_opened_at', Q.desc), Q.take(5))
                .observeWithColumns(['title']),
        [],
        []
    )
    const BUG_LINK =
        'https://github.com/halcyonshift/storyline/issues/new?labels=bug&template=' +
        'bug_report.md&title=%5BBUG%5D'

    const FEATURE_LINK =
        'https://github.com/halcyonshift/storyline/issues/new?labels=enhancement&template=' +
        'feature_request.md&title=%5BFEATURE%5D'

    const DISCORD_LINK = 'https://discord.gg/4Dy9xW7fqQ'

    const handleNew = async () => {
        const work = await database.write(async () => {
            return await database.get<WorkModel>('work').create((work) => {
                work.title = t(
                    `view.storyline.landing.titles.title_${sample(
                        Array.from({ length: 30 }, (_, k) => k + 1)
                    )}`
                )
                work.language = 'en-gb'
                work.status = Status.TODO
            })
        })

        const part = await work.addPart()
        const chapter = await part.addChapter()
        await chapter.addScene()

        navigate(`/work/${work.id}/edit`)
    }

    return (
        <Box className='p-4 grid grid-cols-2 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
            <Paper elevation={1} className='relative row-span-2'>
                <Typography variant='h5' className='px-4 pt-3'>
                    {t('view.storyline.landing.title')}
                </Typography>
                <List>
                    {recentWorks.length ? (
                        <ListItem
                            link='/works'
                            icon={Icons.global.open}
                            primary='view.storyline.landing.navigation.works.primary'
                            secondary='view.storyline.landing.navigation.works.secondary'
                        />
                    ) : null}
                    <MuiListItem disablePadding disableGutters>
                        <ListItemButton onClick={handleNew}>
                            <ListItemIcon sx={{ fontSize: settings.appFontSize * 2 }}>
                                {Icons.global.add}
                            </ListItemIcon>
                            <ListItemText
                                primary={t('view.storyline.landing.navigation.new.primary')}
                                secondary={t('view.storyline.landing.navigation.new.secondary')}
                            />
                        </ListItemButton>
                    </MuiListItem>
                    <ListItem
                        link='/importWork'
                        icon={Icons.importExport.import}
                        primary='view.storyline.landing.navigation.importWork.primary'
                        secondary='view.storyline.landing.navigation.importWork.secondary'
                    />
                    <ListItem
                        link='/backupRestore'
                        icon={Icons.global.backupRestore}
                        primary='view.storyline.landing.navigation.backupRestore.primary'
                        secondary='view.storyline.landing.navigation.backupRestore.secondary'
                    />
                    <ListItem
                        link='/settings'
                        icon={Icons.settings.settings}
                        primary='view.storyline.landing.navigation.settings.primary'
                        secondary='view.storyline.landing.navigation.settings.secondary'
                    />
                    <ListItem
                        link='/info'
                        icon={Icons.global.info}
                        primary='view.storyline.landing.navigation.info.primary'
                        secondary='view.storyline.landing.navigation.info.secondary'
                    />
                </List>
            </Paper>
            <Paper elevation={1} className='relative'>
                <Typography variant='h5' className='px-4 pt-3'>
                    {t('view.storyline.landing.recent.title')}
                </Typography>
                <List>
                    {recentWorks.map((work) => (
                        <ListItem key={work.id} link={`/work/${work.id}`} primary={work.title} />
                    ))}
                </List>
            </Paper>
            <Paper elevation={1} className='relative '>
                <Box className='px-4 pt-5 bg-indigo-50 dark:bg-indigo-900 h-full rounded'>
                    <Box className='grid grid-cols-1 gap-5'>
                        <a title='Go to GitHub' href={BUG_LINK}>
                            <Box>
                                <Typography variant='h4' className='float-left pr-3'>
                                    {GLOBAL_ICONS.bug}
                                </Typography>
                                <Typography variant='body1'>
                                    {t('view.storyline.landing.contact.bug.title')}
                                </Typography>
                                <Typography variant='body2'>
                                    {t('view.storyline.landing.contact.bug.text')}
                                </Typography>
                            </Box>
                        </a>
                        <a title='Go to GitHub' href={FEATURE_LINK}>
                            <Box>
                                <Typography variant='h4' className='float-left pr-3'>
                                    {GLOBAL_ICONS.feature}
                                </Typography>
                                <Typography variant='body1'>
                                    {t('view.storyline.landing.contact.feature.title')}
                                </Typography>
                                <Typography variant='body2'>
                                    {t('view.storyline.landing.contact.feature.text')}
                                </Typography>
                            </Box>
                        </a>
                        <a title='Go to Discord' href={DISCORD_LINK}>
                            <Box>
                                <Typography variant='h4' className='float-left pr-3'>
                                    {GLOBAL_ICONS.help}
                                </Typography>
                                <Typography variant='body1'>
                                    {t('view.storyline.landing.contact.support.title')}
                                </Typography>
                                <Typography variant='body2'>
                                    {t('view.storyline.landing.contact.support.text')}
                                </Typography>
                            </Box>
                        </a>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default LandingView
