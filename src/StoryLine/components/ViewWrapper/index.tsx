import { useEffect, useState, Children, SyntheticEvent, ReactElement } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Stack, Tab } from '@mui/material'
import withObservables from '@nozbe/with-observables'
import { Database, Q } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { useTranslation } from 'react-i18next'
import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { ImageType } from '../Gallery/types'
import { ViewWrapperProps } from './types'
import * as NotePanel from './TabPanel'

const TAB_STYLE = { padding: 0 }

const _ViewWrapper = ({ tabList, model, children, notes }: ViewWrapperProps) => {
    const [value, setValue] = useState<string>('1')
    const [images, setImages] = useState<ImageType[]>([])
    const [links, setLinks] = useState<string[]>([])
    const [appearances, setAppearances] = useState([])
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => {
        setValue('1')
        setShowTabs(true)
        model.getImages().then((images) => setImages(images))
        model.getLinks().then((links) => setLinks(links))
        model.getAppearances().then((appearances) => setAppearances(appearances))
    }, [model?.id, notes])

    return (
        <Box className='flex flex-col flex-grow '>
            <TabContext value={value}>
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
                        {appearances.length ? (
                            <Tab
                                label={t('component.viewWrapper.tab.appearances')}
                                value='appearances'
                            />
                        ) : null}
                        {links.length ? (
                            <Tab label={t('component.viewWrapper.tab.links')} value='links' />
                        ) : null}
                        {images.length ? (
                            <Tab label={t('component.viewWrapper.tab.images')} value='images' />
                        ) : null}
                        {notes.length ? (
                            <Tab label={t('component.viewWrapper.tab.notes')} value='notes' />
                        ) : null}
                    </TabList>
                </Box>
                <Box className='flex-grow h-0 overflow-auto'>
                    {Children.toArray(children).map((child: ReactElement, index) => (
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
                    ))}
                    {appearances.length ? (
                        <TabPanel value='appearances' sx={TAB_STYLE}>
                            <NotePanel.Appearances appearances={appearances} />
                        </TabPanel>
                    ) : null}
                    {links.length ? (
                        <TabPanel value='links' sx={TAB_STYLE}>
                            <NotePanel.Links links={links} />
                        </TabPanel>
                    ) : null}
                    {images.length ? (
                        <TabPanel value='images' sx={TAB_STYLE}>
                            <NotePanel.Images images={images} />
                        </TabPanel>
                    ) : null}
                    {notes.length ? (
                        <TabPanel value='notes' sx={TAB_STYLE}>
                            <NotePanel.Notes notes={notes} />
                        </TabPanel>
                    ) : null}
                </Box>
            </TabContext>
        </Box>
    )
}

const ViewWrapper = withDatabase(
    withObservables(
        ['model'],
        ({
            model,
            database
        }: {
            model: CharacterModel | ItemModel | LocationModel | NoteModel
            database: Database
        }) => ({
            notes: database
                .get('note')
                .query(Q.where(model ? `${model.table}_id` : 'id', model?.id || ''))
                .observe()
        })
    )(_ViewWrapper)
)

export default ViewWrapper
