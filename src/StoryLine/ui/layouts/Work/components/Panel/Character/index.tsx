import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CharacterModel from '../../../../../../db/models/CharacterModel'
import { CHARACTER_ICONS } from '../../../../../icons'
import { CharacterPanelProps } from '../types'

import Panel from '../'

const CharacterPanel = ({ characters }: CharacterPanelProps) => {
    const [main, setMain] = useState<CharacterModel[]>([])
    const [secondary, setSecondary] = useState<CharacterModel[]>([])
    const [tertiary, setTertiary] = useState<CharacterModel[]>([])

    const { t } = useTranslation()

    useEffect(() => {
        setMain(characters.filter((character) => character.isMain))
        setSecondary(characters.filter((character) => character.isSecondary))
        setTertiary(characters.filter((character) => character.isTertiary))
    }, [characters])

    return (
        <Panel
            navigation={[
                {
                    link: 'character/add/main',
                    text: 'layout.work.panel.character.addMain',
                    icon: CHARACTER_ICONS.addMain
                },
                {
                    link: 'character/add/secondary',
                    text: 'layout.work.panel.character.addSecondary',
                    icon: CHARACTER_ICONS.addSecondary
                },
                {
                    link: 'character/add/tertiary',
                    text: 'layout.work.panel.character.addTertiary',
                    icon: CHARACTER_ICONS.addTertiary
                }
            ]}>
            {main.length ? <Typography variant='h6'>{t('model.character.main')}</Typography> : null}
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
