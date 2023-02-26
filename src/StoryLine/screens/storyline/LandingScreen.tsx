/** @format */

import { ReactElement } from 'react'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoIcon from '@mui/icons-material/Info'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useNavigate } from 'react-router-dom'

import Link from '../../components/Link'
import { ProjectModel } from '../../db/models'

const MenuItem = ({ link, icon, text }: { link: string; icon: ReactElement; text: string }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <ListItem disablePadding onClick={() => navigate(link)}>
            <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={t(text)} />
            </ListItemButton>
        </ListItem>
    )
}

const LandingScreen = () => {
    const recentProjects = useLoaderData() as ProjectModel[]
    const { t } = useTranslation()

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant='h5'>{t('screen.storyline.landing.title')}</Typography>
                <List>
                    {recentProjects.length ? (
                        <MenuItem
                            link='/projects'
                            icon={<FileOpenIcon />}
                            text='screen.storyline.landing.navigation.openProject'
                        />
                    ) : null}
                    <MenuItem
                        link='/projects'
                        icon={<AddIcon />}
                        text='screen.storyline.landing.navigation.newProject'
                    />
                    {recentProjects.length ? (
                        <MenuItem
                            link='/projects'
                            icon={<ContentCopyIcon />}
                            text='screen.storyline.landing.navigation.newSequel'
                        />
                    ) : null}
                    <MenuItem
                        link='/projects'
                        icon={<ArrowDownwardIcon />}
                        text='screen.storyline.landing.navigation.importProject'
                    />
                    <MenuItem
                        link='/settings'
                        icon={<SettingsIcon />}
                        text='screen.storyline.landing.navigation.settings'
                    />
                    <MenuItem
                        link='/settings'
                        icon={<InfoIcon />}
                        text='screen.storyline.landing.navigation.info'
                    />
                </List>
            </Grid>
            {recentProjects.length ? (
                <Grid item xs={6}>
                    <Typography variant='h5'>
                        {t('screen.storyline.landing.recent.title')}
                    </Typography>
                    {recentProjects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id}>
                            <Typography variant='body1'>{project.title}</Typography>
                        </Link>
                    ))}
                </Grid>
            ) : null}
        </Grid>
    )
}

export default LandingScreen
