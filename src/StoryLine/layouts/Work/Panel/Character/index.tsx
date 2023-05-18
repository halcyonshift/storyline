import { useEffect, useState } from 'react'
import { List, Typography } from '@mui/material'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Accordion from '@sl/components/Accordion'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import CharacterModel from '@sl/db/models/CharacterModel'
import { CHARACTER_ICONS } from '@sl/constants/icons'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import { WorkModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'
import ListItem from './ListItem'
import { Status } from '@sl/constants/status'

const CharacterPanel = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const settings = useSettings()
    const { t } = useTranslation()
    const characters = useObservable(
        () =>
            work.character
                .extend(Q.sortBy('display_name', Q.asc))
                .observeWithColumns(['display_name', 'status', 'mode']),
        [],
        []
    )

    const [group, setGroup] = useState<boolean>(false)
    const [modeCharacters, setModeCharacters] = useState<{
        [CharacterMode.PRIMARY]: CharacterModel[]
        [CharacterMode.SECONDARY]: CharacterModel[]
        [CharacterMode.TERTIARY]: CharacterModel[]
    }>({
        [CharacterMode.PRIMARY]: [],
        [CharacterMode.SECONDARY]: [],
        [CharacterMode.TERTIARY]: []
    })

    useEffect(() => {
        let _characters = characters
        if (!group) {
            _characters = _characters.filter((character) => character.status !== Status.ARCHIVE)
        }

        setModeCharacters({
            PRIMARY: _characters.filter((character) => character.isPrimary),
            SECONDARY: _characters.filter((character) => character.isSecondary),
            TERTIARY: _characters.filter((character) => character.isTertiary)
        })
    }, [characters, group])

    return (
        <Panel
            action={
                <GroupToggle
                    label={'layout.work.panel.character.groupToggle'}
                    group={group}
                    setGroup={setGroup}
                />
            }
            navigation={[
                {
                    link: `addCharacter/${CharacterMode.PRIMARY}`,
                    text: 'layout.work.panel.character.addPrimary',
                    icon: CHARACTER_ICONS.addPrimary
                },
                {
                    link: `addCharacter/${CharacterMode.SECONDARY}`,
                    text: 'layout.work.panel.character.addSecondary',
                    icon: CHARACTER_ICONS.addSecondary
                },
                {
                    link: `addCharacter/${CharacterMode.TERTIARY}`,
                    text: 'layout.work.panel.character.addTertiary',
                    icon: CHARACTER_ICONS.addTertiary
                }
            ]}>
            {[CharacterMode.PRIMARY, CharacterMode.SECONDARY, CharacterMode.TERTIARY].map(
                (mode: CharacterModeType) =>
                    modeCharacters[mode].length ? (
                        <Accordion
                            id={mode}
                            key={mode}
                            title={<Typography>{t(`constant.characterMode.${mode}`)}</Typography>}
                            sx={{ backgroundColor: settings.getHex(400) }}
                            className='text-white p-1 border-b'>
                            <List dense disablePadding className='bg-white'>
                                {modeCharacters[mode].map((character) => (
                                    <ListItem key={character.id} character={character} />
                                ))}
                            </List>
                        </Accordion>
                    ) : null
            )}
        </Panel>
    )
}

export default CharacterPanel
