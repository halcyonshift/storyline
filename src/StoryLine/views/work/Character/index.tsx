import { useEffect, useState, SyntheticEvent } from 'react'
import {
    Box,
    Divider,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import Image from '@sl/components/Image'
import CharacterModel from '@sl/db/models/CharacterModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { htmlParse } from '@sl/utils'
import { SectionModel, WorkModel } from '@sl/db/models'

// eslint-disable-next-line complexity
const CharacterView = () => {
    const tabs = useTabs()
    const character = useRouteLoaderData('character') as CharacterModel
    const work = useRouteLoaderData('work') as WorkModel
    const [scenes, setScenes] = useState<SectionModel[]>([])
    const [showHistoryTab] = useState<boolean>(Boolean(character.history))
    const [showMotivationTab] = useState<boolean>(Boolean(character.ambitions || character.fears))
    const [showOverviewTab, setShowOverviewTab] = useState<boolean>(false)
    const [showPersonalityTab] = useState<boolean>(
        Boolean(character.personalityPositive || character.personalityNegative)
    )
    const [value, setValue] = useState<string>(
        showHistoryTab ? 'history' : showPersonalityTab ? 'personality' : 'motiviation'
    )
    const { t } = useTranslation()

    useEffect(() => {
        tabs.setShowTabs(true)

        work.scenes.fetch().then(async (scenes) => {
            const appearances: string[] = []
            for await (const scene of scenes) {
                const characters = await scene.characters(character.id)
                if (characters) {
                    appearances.push(scene.id)
                }
            }
            setScenes(
                scenes.filter(
                    (scene) =>
                        scene.pointOfViewCharacter.id === character.id ||
                        appearances.includes(scene.id)
                )
            )
            setShowOverviewTab(Boolean(appearances.length))
            if (appearances.length) setValue('overview')
        })
    }, [])

    return (
        <Box className='p-5 flex-grow overflow-auto h-0'>
            <Box className='grid grid-cols-3 gap-3'>
                <Stack spacing={2} className='col-span-2'>
                    <Box>
                        <Typography variant='body2' className='uppercase'>
                            {t(`constant.characterMode.${character.mode}`)}
                        </Typography>
                        <Typography variant='h4'>
                            {character.displayName}
                            <Typography component='span' variant='body2' className='pl-1'>
                                {[
                                    character.gender,
                                    character.sexualOrientation,
                                    character.pronouns ? `(${character.pronouns})` : ''
                                ].join(' ')}
                            </Typography>
                        </Typography>
                        <Typography variant='body1'>
                            {[
                                character.firstName,
                                character.nickname ? `"${character.nickname}"` : '',
                                character.lastName
                            ].join(' ')}
                        </Typography>
                        {character.dateOfBirth ? (
                            <Typography variant='body1'>
                                {[
                                    character.dateOfBirth ? character.displayDateOfBirth : '',
                                    character.apparentAge
                                ].join(' ')}
                            </Typography>
                        ) : null}
                    </Box>
                    <Box>
                        <Typography variant='body1'>
                            {[character.ethnicity, character.nationality].join(' ')}
                        </Typography>
                        {character.placeOfBirth ? (
                            <Typography variant='body1'>{character.placeOfBirth}</Typography>
                        ) : null}
                        {character.residence ? (
                            <Typography variant='body1'>{character.residence}</Typography>
                        ) : null}
                        {character.religion ? (
                            <Typography variant='body1'>{character.religion}</Typography>
                        ) : null}
                        {character.socialClass ? (
                            <Typography variant='body1'>{character.socialClass}</Typography>
                        ) : null}
                        {character.education ? (
                            <Typography variant='body1'>{character.education}</Typography>
                        ) : null}
                        {character.profession ? (
                            <Typography variant='body1'>{character.profession}</Typography>
                        ) : null}
                        {character.finances ? (
                            <Typography variant='body1'>{character.finances}</Typography>
                        ) : null}
                        {character.politicalLeaning ? (
                            <Typography variant='body1'>{character.politicalLeaning}</Typography>
                        ) : null}
                        {character.face ? (
                            <Typography variant='body1'>{character.face}</Typography>
                        ) : null}
                        {character.build ? (
                            <Typography variant='body1'>{character.build}</Typography>
                        ) : null}
                        {character.height ? (
                            <Typography variant='body1'>{character.height}</Typography>
                        ) : null}
                        {character.weight ? (
                            <Typography variant='body1'>{character.weight}</Typography>
                        ) : null}
                        {character.hair ? (
                            <Typography variant='body1'>{character.hair}</Typography>
                        ) : null}
                        {character.distinguishingFeatures
                            ? htmlParse(character.distinguishingFeatures)
                            : ''}
                    </Box>
                    <Divider />
                    {htmlParse(character.description)}
                </Stack>
                <Box>
                    <Image path={character.image} />
                </Box>
            </Box>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={(_: SyntheticEvent, value: string) => setValue(value)}
                        aria-label=''>
                        {showOverviewTab ? (
                            <Tab label={t('view.work.character.tab.overview')} value='overview' />
                        ) : null}
                        {showHistoryTab ? (
                            <Tab label={t('view.work.character.tab.history')} value='history' />
                        ) : null}
                        {showPersonalityTab ? (
                            <Tab
                                label={t('view.work.character.tab.personality')}
                                value='personality'
                            />
                        ) : null}
                        {showMotivationTab ? (
                            <Tab
                                label={t('view.work.character.tab.motivation')}
                                value='motivation'
                            />
                        ) : null}
                    </TabList>
                </Box>
                {showOverviewTab ? (
                    <TabPanel value='overview' sx={{ paddingX: 0 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {t('view.work.character.table.th.pov')}
                                        </TableCell>
                                        <TableCell>
                                            {t('view.work.character.table.th.date')}
                                        </TableCell>
                                        <TableCell>
                                            {t('view.work.character.table.th.scene')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {scenes.map((scene) => (
                                        <TableRow
                                            key={scene.id}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}>
                                            <TableCell scope='row'>
                                                {scene.pointOfViewCharacter.id === character.id
                                                    ? 'POV'
                                                    : ''}
                                            </TableCell>
                                            <TableCell scope='row'>
                                                {scene.displayDateTime}
                                            </TableCell>
                                            <TableCell>{scene.displayTitle}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                ) : null}
                {showHistoryTab ? (
                    <TabPanel value='history'>{htmlParse(character.history)}</TabPanel>
                ) : null}
                {showPersonalityTab ? (
                    <TabPanel value='personality'>
                        {character.personalityPositive
                            ? htmlParse(character.personalityPositive)
                            : ''}
                        {character.personalityNegative
                            ? htmlParse(character.personalityNegative)
                            : ''}
                    </TabPanel>
                ) : null}
                {showMotivationTab ? (
                    <TabPanel value='motivation'>
                        {character.ambitions ? htmlParse(character.ambitions) : ''}
                        {character.fears ? htmlParse(character.fears) : ''}
                    </TabPanel>
                ) : null}
            </TabContext>
        </Box>
    )
}

export default CharacterView
