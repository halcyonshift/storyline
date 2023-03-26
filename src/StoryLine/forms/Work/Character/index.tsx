import { useState, SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useObservable } from 'rxjs-hooks'
import * as yup from 'yup'
import FormButton from '@sl/components/FormButton'
import { CharacterDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import * as NotePanel from '../TabPanel'
import * as Panel from './TabPanel'
import { CharacterFormProps } from './types'

const CharacterForm = ({
    work,
    character,
    mode,
    initialValues = {
        mode,
        image: '',
        displayName: '',
        description: '',
        history: '',
        pronouns: '',
        firstName: '',
        lastName: '',
        nickname: '',
        nationality: '',
        ethnicity: '',
        placeOfBirth: '',
        residence: '',
        gender: '',
        sexualOrientation: '',
        dateOfBirth: '',
        apparentAge: null,
        religion: '',
        socialClass: '',
        education: '',
        profession: '',
        finances: '',
        politicalLeaning: '',
        face: '',
        build: '',
        height: '',
        weight: '',
        hair: '',
        hairNatural: '',
        distinguishingFeatures: '',
        personalityPositive: '',
        personalityNegative: '',
        ambitions: '',
        fears: ''
    }
}: CharacterFormProps) => {
    const [value, setValue] = useState<string>('1')
    const messenger = useMessenger()
    const { t } = useTranslation()
    const notes = useObservable(() => character.note.observeWithColumns(['title']), [], [])

    const validationSchema = yup.object({
        image: yup.string().nullable(),
        displayName: yup.string().required(t('form.work.character.displayName.required')),
        description: yup.string().nullable(),
        history: yup.string().nullable(),
        pronouns: yup.string().nullable(),
        firstName: yup.string().nullable(),
        lastName: yup.string().nullable(),
        nickname: yup.string().nullable(),
        nationality: yup.string().nullable(),
        ethnicity: yup.string().nullable(),
        placeOfBirth: yup.string().nullable(),
        residence: yup.string().nullable(),
        gender: yup.string().nullable(),
        sexualOrientation: yup.string().nullable(),
        dateOfBirth: yup.string().nullable(),
        apparentAge: yup.string().nullable(),
        religion: yup.string().nullable(),
        socialClass: yup.string().nullable(),
        education: yup.string().nullable(),
        profession: yup.string().nullable(),
        finances: yup.string().nullable(),
        politicalLeaning: yup.string().nullable(),
        face: yup.string().nullable(),
        build: yup.string().nullable(),
        height: yup.string().nullable(),
        weight: yup.string().nullable(),
        hair: yup.string().nullable(),
        hairNatural: yup.string().nullable(),
        distinguishingFeatures: yup.string().nullable(),
        personalityPositive: yup.string().nullable(),
        personalityNegative: yup.string().nullable(),
        ambitions: yup.string().nullable(),
        fears: yup.string().nullable()
    })

    const form: FormikProps<CharacterDataType> = useFormik<CharacterDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: CharacterDataType) => {
            if (character?.id) {
                await character.updateCharacter(values)
            } else {
                await work.addCharacter(mode, values)
            }
            messenger.success(t('form.work.character.alert.success'))
        }
    })

    const handleTabChange = (event: SyntheticEvent, value: string) => setValue(value)

    return (
        <Box component='form' onSubmit={form.handleSubmit} autoComplete='off'>
            <TabContext value={value}>
                <Box className='border-b'>
                    <TabList onChange={handleTabChange} aria-label=''>
                        <Tab label={t('form.work.character.tab.general')} value='1' />
                        <Tab label={t('form.work.character.tab.demographics')} value='2' />
                        <Tab label={t('form.work.character.tab.appearance')} value='3' />
                        <Tab label={t('form.work.character.tab.about')} value='4' />
                        {notes.filter((note) => note.image).length ? (
                            <Tab label={t('form.work.character.tab.images')} value='5' />
                        ) : null}
                        {notes.length ? (
                            <Tab label={t('form.work.character.tab.notes')} value='6' />
                        ) : null}
                    </TabList>
                </Box>
                <TabPanel value='1' sx={{ padding: 0 }}>
                    <Panel.General form={form} />
                </TabPanel>
                <TabPanel value='2' sx={{ padding: 0 }}>
                    <Panel.Demographics form={form} />
                </TabPanel>
                <TabPanel value='3' sx={{ padding: 0 }}>
                    <Panel.Appearance form={form} />
                </TabPanel>
                <TabPanel value='4' sx={{ padding: 0 }}>
                    <Panel.About form={form} />
                </TabPanel>
                {notes.filter((note) => note.image).length ? (
                    <TabPanel value='5' sx={{ padding: 0 }}>
                        <NotePanel.Images notes={notes.filter((note) => note.image)} />
                    </TabPanel>
                ) : null}
                {notes.length ? (
                    <TabPanel value='6' sx={{ padding: 0 }}>
                        <NotePanel.Notes notes={notes} />
                    </TabPanel>
                ) : null}
            </TabContext>
            {!['5', '6'].includes(value) ? (
                <Box className='m-3'>
                    <FormButton
                        label={t(
                            character?.id
                                ? 'form.work.character.button.update'
                                : 'form.work.character.button.create'
                        )}
                    />
                </Box>
            ) : null}
        </Box>
    )
}

export default CharacterForm
