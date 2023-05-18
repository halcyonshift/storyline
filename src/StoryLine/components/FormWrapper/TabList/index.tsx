import { SyntheticEvent } from 'react'
import { TabList as MuiTabList } from '@mui/lab'
import { Badge, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FormTabListProps } from '../types'

const TabList = ({ setValue, tabList, errorBadges, notes }: FormTabListProps) => {
    const { t } = useTranslation()

    return (
        <MuiTabList onChange={(_: SyntheticEvent, value: string) => setValue(value)} aria-label=''>
            {tabList.map((tab, index) => (
                <Tab
                    key={`tab-${index + 1}`}
                    label={
                        errorBadges[index.toString()] ? (
                            <Badge variant='dot' color='error'>
                                {tab}
                            </Badge>
                        ) : (
                            tab
                        )
                    }
                    value={(index + 1).toString()}
                />
            ))}
            {notes.filter((note) => note.image).length ? (
                <Tab label={t('component.formWrapper.tab.images')} value='images' />
            ) : null}
            {notes.length ? (
                <Tab label={t('component.formWrapper.tab.notes')} value='notes' />
            ) : null}
        </MuiTabList>
    )
}

export default TabList
