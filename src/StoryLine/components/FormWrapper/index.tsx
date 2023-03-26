import { useEffect, useState, SyntheticEvent } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { useObservable } from 'rxjs-hooks'
import Status from '@sl/components/Status'
import NoteModel from '@sl/db/models/NoteModel'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { FormWrapperProps } from './types'
import { useTranslation } from 'react-i18next'
import * as NotePanel from './TabPanel'
import FormButton from '../FormButton'

const FormWrapper = ({ form, tabList, title, model, header, children }: FormWrapperProps) => {
    const [value, setValue] = useState<string>('1')
    const tabs = useTabs()
    const { t } = useTranslation()
    useEffect(() => tabs.setShowTabs(false), [])
    let notes: NoteModel[] = []

    if (model) {
        notes = useObservable(() => model.notes.observeWithColumns(['title']), [], [])
    }

    const handleTabChange = (_: SyntheticEvent, value: string) => setValue(value)

    return (
        <Box className='flex flex-col flex-grow'>
            <Box className='px-3 py-2 flex justify-between h-12'>
                {title ? <Typography variant='h6'>{title}</Typography> : null}
                <Stack spacing={1} direction='row'>
                    {header}
                    {model ? <Status model={model} /> : null}
                </Stack>
            </Box>
            <Divider />
            <Box className={`flex-grow h-0 overflow-auto`}>
                <Box component='form' onSubmit={form.handleSubmit} autoComplete='off'>
                    <TabContext value={value}>
                        <Box className='border-b'>
                            <TabList onChange={handleTabChange} aria-label=''>
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
                        {children.map((child, index) => (
                            <TabPanel
                                key={`tabPanel-${index + 1}`}
                                value={(index + 1).toString()}
                                sx={{ padding: 0 }}>
                                {child}
                            </TabPanel>
                        ))}
                        {notes.filter((note) => note.image).length ? (
                            <TabPanel value='images' sx={{ padding: 0 }}>
                                <NotePanel.Images notes={notes.filter((note) => note.image)} />
                            </TabPanel>
                        ) : null}
                        {notes.length ? (
                            <TabPanel value='notes' sx={{ padding: 0 }}>
                                <NotePanel.Notes notes={notes} />
                            </TabPanel>
                        ) : null}
                    </TabContext>
                    {!['images', 'notes'].includes(value) ? (
                        <Box className='m-3'>
                            <FormButton
                                label={t(
                                    model
                                        ? 'component.formButton.update'
                                        : 'component.formButton.create'
                                )}
                            />
                        </Box>
                    ) : null}
                </Box>
            </Box>
        </Box>
    )
}

export default FormWrapper
