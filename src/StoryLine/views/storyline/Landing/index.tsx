import { Add, ArrowDownward, FileOpen, Settings, Info } from '@mui/icons-material'
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
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'

const LandingView = () => {
    const database = useDatabase()
    const navigate = useNavigate()
    const recentWorks = useLoaderData() as WorkModel[]
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
        <Box className='p-4 grid grid-cols-2 grid-rows-2 gap-4 flex-grow bg-slate-50'>
            <Paper elevation={1} className='relative'>
                <Typography variant='h6' className='px-4 pt-3'>
                    {t('view.storyline.landing.title')}
                </Typography>
                <List>
                    {recentWorks.length ? (
                        <ListItem
                            link='/works'
                            icon={<FileOpen />}
                            text='view.storyline.landing.navigation.works'
                        />
                    ) : null}
                    <MuiListItem disablePadding disableGutters>
                        <ListItemButton onClick={handleNew}>
                            <ListItemIcon>
                                <Add />
                            </ListItemIcon>
                            <ListItemText primary={t('view.storyline.landing.navigation.new')} />
                        </ListItemButton>
                    </MuiListItem>
                    <ListItem
                        link='/importWork'
                        icon={<ArrowDownward />}
                        text='view.storyline.landing.navigation.importWork'
                    />
                    <ListItem
                        link='/settings'
                        icon={<Settings />}
                        text='view.storyline.landing.navigation.settings'
                    />
                    <ListItem
                        link='/info'
                        icon={<Info />}
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
