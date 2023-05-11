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
import { sample } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useNavigate } from 'react-router-dom'
import ListItem from '@sl/components/ListItem'
import Icons from '@sl/constants/icons'
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'

const LandingView = () => {
    const database = useDatabase()
    const navigate = useNavigate()
    const recentWorks = useLoaderData() as WorkModel[]
    const settings = useSettings()
    const { t } = useTranslation()

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
        // eslint-disable-next-line max-len
        <Box className='p-4 grid grid-cols-2 grid-rows-2 gap-4 flex-grow bg-slate-50 dark:bg-neutral-700'>
            <Paper elevation={1} className='relative'>
                <Typography variant='h6' className='px-4 pt-3'>
                    {t('view.storyline.landing.title')}
                </Typography>
                <List>
                    {recentWorks.length ? (
                        <ListItem
                            link='/works'
                            icon={Icons.global.open}
                            text='view.storyline.landing.navigation.works'
                        />
                    ) : null}
                    <MuiListItem disablePadding disableGutters>
                        <ListItemButton onClick={handleNew}>
                            <ListItemIcon sx={{ fontSize: settings.appFontSize * 2 }}>
                                {Icons.global.add}
                            </ListItemIcon>
                            <ListItemText primary={t('view.storyline.landing.navigation.new')} />
                        </ListItemButton>
                    </MuiListItem>
                    <ListItem
                        link='/importWork'
                        icon={Icons.importExport.import}
                        text='view.storyline.landing.navigation.importWork'
                    />
                    <ListItem
                        link='/settings'
                        icon={Icons.settings.settings}
                        text='view.storyline.landing.navigation.settings'
                    />
                    <ListItem
                        link='/info'
                        icon={Icons.global.info}
                        text='view.storyline.landing.navigation.info'
                    />
                </List>
            </Paper>
            <Paper elevation={1} className='relative'>
                <Typography variant='h6' className='px-4 pt-3'>
                    {t('view.storyline.landing.recent.title')}
                </Typography>
                <List>
                    {recentWorks.map((work) => (
                        <ListItem key={work.id} link={`/work/${work.id}`} text={work.title} />
                    ))}
                </List>
            </Paper>
            <Box></Box>
            <Paper elevation={1} className='relative'>
                <Typography variant='h6' className='px-4 pt-3'>
                    {t('view.storyline.landing.feedback.title')}
                </Typography>
            </Paper>
        </Box>
    )
}

export default LandingView
