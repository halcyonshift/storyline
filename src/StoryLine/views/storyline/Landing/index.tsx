import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoIcon from '@mui/icons-material/Info'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import { default as MuiListItem } from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { sample } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useNavigate } from 'react-router-dom'
import ListItem from '@sl/components/ListItem'
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'
import { useDatabase } from '@nozbe/watermelondb/hooks'

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

        navigate(`/work/${work.id}`)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant='h5'>{t('view.storyline.landing.title')}</Typography>
                <List>
                    {recentWorks.length ? (
                        <ListItem
                            link='/works'
                            icon={<FileOpenIcon />}
                            text='view.storyline.landing.navigation.works'
                        />
                    ) : null}
                    <MuiListItem disablePadding disableGutters>
                        <ListItemButton onClick={handleNew}>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary={t('view.storyline.landing.navigation.new')} />
                        </ListItemButton>
                    </MuiListItem>
                    <ListItem
                        link='/importWork'
                        icon={<ArrowDownwardIcon />}
                        text='view.storyline.landing.navigation.importWork'
                    />
                    <ListItem
                        link='/settings'
                        icon={<SettingsIcon />}
                        text='view.storyline.landing.navigation.settings'
                    />
                    <ListItem
                        link='/info'
                        icon={<InfoIcon />}
                        text='view.storyline.landing.navigation.info'
                    />
                </List>
            </Grid>
            {recentWorks.length ? (
                <Grid item xs={6}>
                    <Typography variant='h6'>{t('view.storyline.landing.recent.title')}</Typography>
                    {recentWorks.map((work) => (
                        <ListItem
                            key={work.id}
                            link={`/work/${work.id}`}
                            icon={<ArrowRightIcon />}
                            text={work.title}
                        />
                    ))}
                </Grid>
            ) : null}
        </Grid>
    )
}

export default LandingView
