import { useEffect, useState, Children, SyntheticEvent, ReactElement } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import withObservables from '@nozbe/with-observables'
import { Database, Q } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import Status from '@sl/components/Status'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { FormWrapperProps } from './types'
import { useTranslation } from 'react-i18next'
import * as NotePanel from './TabPanel'
import FormButton from '../FormButton'
import { CharacterModel, ItemModel, LocationModel, NoteModel, SectionModel } from '@sl/db/models'
import useSettings from '@sl/theme/useSettings'

const TAB_STYLE = { padding: 0 }

// eslint-disable-next-line complexity
const _FormWrapper = ({
    form,
    tabList,
    title,
    model,
    header,
    children,
    notes
}: FormWrapperProps) => {
    const [value, setValue] = useState<string>('1')
    const tabs = useTabs()
    const { t } = useTranslation()
    const noButton = ['images', 'notes']
    const settings = useSettings()

    useEffect(() => {
        if (tabs?.setShowTabs) tabs.setShowTabs(false)
        setValue('1')
    }, [model?.id])

    return (
        <Box className='flex flex-col flex-grow'>
            <Box
                className='px-3 py-2 flex justify-between h-12 overflow-hidden'
                sx={{ backgroundColor: settings.getHex(50) }}>
                {title ? <Typography variant='h6'>{title}</Typography> : null}
                <Stack spacing={1} direction='row'>
                    {header}
                    {model ? <Status model={model} /> : null}
                </Stack>
            </Box>
            <Divider />
            <Box component='form' onSubmit={form.handleSubmit} autoComplete='off'>
                <TabContext value={value}>
                    {tabList.length > 1 || notes.length ? (
                        <Box className='border-b'>
                            <TabList
                                onChange={(_: SyntheticEvent, value: string) => setValue(value)}
                                aria-label=''>
                                {tabList.map((tab, index) => (
                                    <Tab
                                        key={`tab-${index + 1}`}
                                        label={tab}
                                        value={(index + 1).toString()}
                                    />
                                ))}
                                {notes.filter((note) => note.image).length ? (
                                    <Tab
                                        label={t('component.formWrapper.tab.images')}
                                        value='images'
                                    />
                                ) : null}
                                {notes.length ? (
                                    <Tab
                                        label={t('component.formWrapper.tab.notes')}
                                        value='notes'
                                    />
                                ) : null}
                            </TabList>
                        </Box>
                    ) : null}

                    {Children.toArray(children).map((child: ReactElement, index) => {
                        if (child.props.showButton === false) noButton.push((index + 1).toString())
                        return (
                            <TabPanel
                                key={`tabPanel-${index + 1}`}
                                value={(index + 1).toString()}
                                sx={TAB_STYLE}>
                                <Stack
                                    spacing={1}
                                    className={child.props.padding === false ? '' : 'px-3 pt-1'}>
                                    {child}
                                </Stack>
                            </TabPanel>
                        )
                    })}
                    {notes.filter((note) => note.image).length ? (
                        <TabPanel value='images' sx={TAB_STYLE}>
                            <NotePanel.Images notes={notes.filter((note) => note.image)} />
                        </TabPanel>
                    ) : null}
                    {notes.length ? (
                        <TabPanel value='notes' sx={TAB_STYLE}>
                            <NotePanel.Notes notes={notes} />
                        </TabPanel>
                    ) : null}
                </TabContext>
                {!noButton.includes(value) ? (
                    <Box className='m-3'>
                        <FormButton label={t('component.formButton.save')} />
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

const FormWrapper = withDatabase(
    withObservables(
        ['model'],
        ({
            model,
            database
        }: {
            model: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel
            database: Database
        }) => ({
            notes: database
                .get('note')
                .query(Q.where(model ? `${model.table}_id` : 'id', model?.id || ''))
                .observe()
        })
    )(_FormWrapper)
)

export default FormWrapper
