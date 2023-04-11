import { useEffect, useState } from 'react'
import {
    Box,
    Divider,
    List,
    ListItem as MuiListItem,
    ListItemText,
    Stack,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import Image from '@sl/components/Image'
import ViewWrapper from '@sl/components/ViewWrapper'
import { CharacterModel } from '@sl/db/models'
import { htmlParse } from '@sl/utils'

const ListItem = ({ primary, secondary }: { primary: string; secondary: string }) =>
    secondary ? (
        <MuiListItem disableGutters disablePadding>
            <ListItemText
                primary={
                    <Typography variant='body2' color='secondary'>
                        {primary}
                    </Typography>
                }
                secondary={<Typography variant='body1'>{secondary}</Typography>}
            />
        </MuiListItem>
    ) : (
        <></>
    )

// eslint-disable-next-line complexity
const CharacterView = () => {
    const { t } = useTranslation()
    const DEFAULT_TABS = [t('component.viewWrapper.tab.general')]
    const character = useRouteLoaderData('character') as CharacterModel
    const [tabList, setTabList] = useState<string[]>(DEFAULT_TABS)
    const [showHistoryTab] = useState<boolean>(Boolean(character.history))
    const [showMotivationTab] = useState<boolean>(Boolean(character.ambitions || character.fears))
    const [showPersonalityTab] = useState<boolean>(
        Boolean(character.personalityPositive || character.personalityNegative)
    )

    useEffect(() => {
        const _tabList = DEFAULT_TABS
        if (showHistoryTab) _tabList.push(t('view.work.character.tab.history'))
        if (showPersonalityTab) _tabList.push(t('view.work.character.tab.personality'))
        if (showMotivationTab) _tabList.push(t('view.work.character.tab.motivation'))
        setTabList(_tabList)
    }, [character.id, showHistoryTab, showPersonalityTab, showMotivationTab])

    return (
        <ViewWrapper tabList={tabList} model={character}>
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

                    <List disablePadding className='grid grid-cols-2'>
                        {[
                            'nationality',
                            'placeOfBirth',
                            'residence',
                            'religion',
                            'socialClass',
                            'education',
                            'profession',
                            'finances',
                            'politicalLeaning'
                        ].map((field) => (
                            <ListItem
                                primary={t(`form.work.character.${field}`)}
                                secondary={character[field as keyof CharacterModel] as string}
                            />
                        ))}
                    </List>
                    <List disablePadding className='grid grid-cols-2'>
                        {[
                            'ethnicity',
                            'face',
                            'build',
                            'height',
                            'weight',
                            'hair',
                            'hairNatural'
                        ].map((field) => (
                            <ListItem
                                primary={t(`form.work.character.${field}`)}
                                secondary={character[field as keyof CharacterModel] as string}
                            />
                        ))}
                    </List>
                    <Box>
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
            {showHistoryTab ? <Box>{htmlParse(character.history)}</Box> : null}
            {showPersonalityTab ? (
                <Box>
                    {character.personalityPositive ? htmlParse(character.personalityPositive) : ''}
                    {character.personalityNegative ? htmlParse(character.personalityNegative) : ''}
                </Box>
            ) : null}
            {showMotivationTab ? (
                <Box>
                    {character.ambitions ? htmlParse(character.ambitions) : ''}
                    {character.fears ? htmlParse(character.fears) : ''}
                </Box>
            ) : null}
        </ViewWrapper>
    )
}

export default CharacterView
