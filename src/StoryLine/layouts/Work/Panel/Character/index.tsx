import { useEffect, useState } from 'react'
import { List, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import Accordion from '@sl/components/Accordion'
import Panel from '@sl/components/Panel'
import CharacterModel from '@sl/db/models/CharacterModel'
import { CHARACTER_ICONS } from '@sl/constants/icons'
import { CharacterMode, type CharacterModeType } from '@sl/constants/characterMode'
import useSettings from '@sl/theme/useSettings'
import ListItem from './ListItem'
import useTabs from '../../Tabs/useTabs'

const CharacterPanel = () => {
    const [modeCharacters, setModeCharacters] = useState<{
        [CharacterMode.PRIMARY]: CharacterModel[]
        [CharacterMode.SECONDARY]: CharacterModel[]
        [CharacterMode.TERTIARY]: CharacterModel[]
    }>({
        [CharacterMode.PRIMARY]: [],
        [CharacterMode.SECONDARY]: [],
        [CharacterMode.TERTIARY]: []
    })

    const { characters } = useTabs()
    const settings = useSettings()
    const { t } = useTranslation()

    useEffect(() => {
        setModeCharacters({
            PRIMARY: characters.filter((character) => character.isPrimary),
            SECONDARY: characters.filter((character) => character.isSecondary),
            TERTIARY: characters.filter((character) => character.isTertiary)
        })
    }, [characters])

    return (
        <Panel
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
