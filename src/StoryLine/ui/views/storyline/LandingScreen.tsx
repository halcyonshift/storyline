import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoIcon from '@mui/icons-material/Info'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'

import ListItem from '../../components/ListItem'
import { WorkModel } from '../../../db/models'

const LandingScreen = () => {
    const recentWorks = useLoaderData() as WorkModel[]
    const { t } = useTranslation()

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant='h5'>{t('screen.storyline.landing.title')}</Typography>
                <List>
                    {recentWorks.length ? (
                        <ListItem
                            link='/openWork'
                            icon={<FileOpenIcon />}
                            text='screen.storyline.landing.navigation.openWork'
                        />
                    ) : null}
                    <ListItem
                        link='/newWork'
                        icon={<AddIcon />}
                        text='screen.storyline.landing.navigation.newWork'
                    />
                    {recentWorks.length ? (
                        <ListItem
                            link='/newSequel'
                            icon={<ContentCopyIcon />}
                            text='screen.storyline.landing.navigation.newSequel'
                        />
                    ) : null}
                    <ListItem
                        link='/importWork'
                        icon={<ArrowDownwardIcon />}
                        text='screen.storyline.landing.navigation.importWork'
                    />
                    <ListItem
                        link='/settings'
                        icon={<SettingsIcon />}
                        text='screen.storyline.landing.navigation.settings'
                    />
                    <ListItem
                        link='/info'
                        icon={<InfoIcon />}
                        text='screen.storyline.landing.navigation.info'
                    />
                </List>
            </Grid>
            {recentWorks.length ? (
                <Grid item xs={6}>
                    <Typography variant='h5'>
                        {t('screen.storyline.landing.recent.title')}
                    </Typography>
                    {recentWorks.map((work) => (
                        <ListItem
                            key={work.id}
                            link={`/works/${work.id}`}
                            icon={<ArrowRightIcon />}
                            text={work.title}
                        />
                    ))}
                </Grid>
            ) : null}
        </Grid>
    )
}

export default LandingScreen
