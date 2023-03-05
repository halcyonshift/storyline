import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CharacterModel from '@sl/db/models/CharacterModel'
import { CHARACTER_ICONS } from '@sl/constants/icons'
import { CharacterPanelProps } from '../types'

import Panel from '../'

const CharacterPanel = ({ characters }: CharacterPanelProps) => {
    const [primary, setPrimary] = useState<CharacterModel[]>([])
    const [secondary, setSecondary] = useState<CharacterModel[]>([])
    const [tertiary, setTertiary] = useState<CharacterModel[]>([])

    const { t } = useTranslation()

    useEffect(() => {
        setPrimary(characters.filter((character) => character.isPrimary))
        setSecondary(characters.filter((character) => character.isSecondary))
        setTertiary(characters.filter((character) => character.isTertiary))
    }, [characters])

    return (
        <Panel
            navigation={[
                {
                    link: 'addCharacter/primary',
                    text: 'layout.work.panel.character.addPrimary',
                    icon: CHARACTER_ICONS.addPrimary
                },
                {
                    link: 'addCharacter/secondary',
                    text: 'layout.work.panel.character.addSecondary',
                    icon: CHARACTER_ICONS.addSecondary
                },
                {
                    link: 'addCharacter/tertiary',
                    text: 'layout.work.panel.character.addTertiary',
                    icon: CHARACTER_ICONS.addTertiary
                }
            ]}>
            {primary.length ? (
                <Typography variant='h6'>{t('model.character.primary')}</Typography>
            ) : null}
            {secondary.length ? (
                <Typography variant='h6'>{t('model.character.secondary')}</Typography>
            ) : null}
            {tertiary.length ? (
                <Typography variant='h6'>{t('model.character.tertiary')}</Typography>
            ) : null}
        </Panel>
    )
}

export default CharacterPanel
