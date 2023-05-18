import { useEffect, useRef, useState, Children, ReactElement } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { Box, Button, Stack, Typography } from '@mui/material'
import withObservables from '@nozbe/with-observables'
import { Database, Q } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { useTranslation } from 'react-i18next'
import Status from '@sl/components/Status'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import * as NotePanel from './TabPanel'
import TabList from './TabList'
import { FormWrapperProps, ErrorBadgeType, FormFieldType } from './types'

const TAB_STYLE = { padding: 0 }

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
    const [errorBadges, setErrorBadges] = useState<ErrorBadgeType>({})
    const [formFields, setFormFields] = useState<FormFieldType>({})
    const [calledFields, setCalledFields] = useState<boolean>(false)
    const tabs = useTabs()
    const { t } = useTranslation()
    const noButton = ['images', 'notes']
    const settings = useSettings()
    const panelsRef = useRef([])

    const getFormFields = async (): Promise<void> => {
        if (calledFields) return
        setCalledFields(true)

        for (const index of Array.from({ length: tabList.length }, (_, k) => k)) {
            await new Promise((resolve) => setTimeout(resolve, 0))
            setValue((index + 1).toString())
        }
        setValue('1')
    }

    useEffect(() => {
        if (tabs?.setShowTabs) tabs.setShowTabs(false)
        setValue('1')
    }, [model?.id])

    useEffect(() => {
        if (formFields[value] || tabs.showTabs) return
        setFormFields({
            ...formFields,
            [value]: Object.keys(form.initialValues).reduce((arr: string[], name: string) => {
                if (panelsRef.current[parseInt(value) - 1]) {
                    const field = panelsRef.current[parseInt(value) - 1].querySelector(`#${name}`)
                    if (field) arr.push(name)
                }
                return arr
            }, [])
        })
    }, [value, tabs.showTabs])

    useEffect(() => {
        panelsRef.current = panelsRef.current.slice(0, tabList.length)
        if (!tabs.showTabs && panelsRef.current.length === tabList.length) {
            getFormFields()
        }
    }, [tabList, tabs.showTabs])

    useEffect(() => {
        setErrorBadges({})
        if (!Object.keys(form.errors).length || !Object.keys(form.touched).length) return
        const _errorBadges: ErrorBadgeType = {}

        Object.keys(form.errors).map((name) => {
            Object.entries(formFields).map(([key, values]) => {
                const index = (parseInt(key) - 1).toString()
                if (values.includes(name)) {
                    if (!_errorBadges[index]) _errorBadges[index] = 0
                    _errorBadges[index] += 1
                }
            })
        })
        setErrorBadges(_errorBadges)
    }, [form.errors, form.touched])

    return !tabs.showTabs ? (
        <Box className='flex flex-col flex-grow overflow-hidden'>
            <Box
                className={`px-3 flex flex-shrink-0 justify-between items-center ${settings.getHeaderHeight()} overflow-hidden border-b`}
                sx={{ backgroundColor: settings.getHex(settings.isDark() ? 800 : 50) }}>
                {title ? (
                    <Typography
                        variant='h6'
                        className='flex flex-grow text-ellipses whitespace-nowrap overflow-hidden w-0'>
                        {title}
                    </Typography>
                ) : null}
                <Stack spacing={1} direction='row'>
                    {header}
                    {model ? <Status model={model} /> : null}
                </Stack>
            </Box>
            <Box
                component='form'
                onSubmit={form.handleSubmit}
                autoComplete='off'
                className='flex-grow'>
                <TabContext value={value}>
                    <Box className='h-full flex flex-grow flex-col'>
                        {tabList.length > 1 || notes.length ? (
                            <Box className='border-b'>
                                <TabList
                                    setValue={setValue}
                                    errorBadges={errorBadges}
                                    notes={notes}
                                    tabList={tabList}
                                />
                            </Box>
                        ) : null}
                        <Box className='flex-grow h-0 overflow-auto'>
                            {Children.toArray(children).map((child: ReactElement, index) => {
                                if (child.props.showButton === false)
                                    noButton.push((index + 1).toString())
                                return (
                                    <TabPanel
                                        ref={(el) => (panelsRef.current[index] = el)}
                                        key={`tabPanel-${index + 1}`}
                                        value={(index + 1).toString()}
                                        sx={TAB_STYLE}>
                                        <Stack
                                            spacing={1}
                                            className={child.props.padding === false ? '' : 'p-3'}>
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
                        </Box>
                        {!noButton.includes(value) ? (
                            <Box className='p-3 border-t'>
                                <Box className='text-right'>
                                    <Button type='submit' variant='contained' color='primary'>
                                        {t('component.formWrapper.button.save')}
                                    </Button>
                                </Box>
                            </Box>
                        ) : null}
                    </Box>
                </TabContext>
            </Box>
        </Box>
    ) : null
}

const FormWrapper = withDatabase(
    withObservables(
        ['model'],
        ({
            model,
            database
        }: {
            model: CharacterModel | ItemModel | LocationModel | NoteModel | SectionModel | WorkModel
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
