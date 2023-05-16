import { ReactElement } from 'react'
import { FormikProps, useFormik } from 'formik'
import FormWrapper from '@sl/components/FormWrapper'
import database from '@sl/db'
import { ItemModel, WorkModel } from '@sl/db/models'
import { ItemDataType } from '@sl/db/models/types'
import ImageField from '@sl/components/form/ImageField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { render, screen } from '../../test-utils'

const MockForm = ({ item, initialValues }: { item?: ItemModel; initialValues: any }) => {
    const form: FormikProps<ItemDataType> = useFormik<ItemDataType>({
        initialValues,
        onSubmit: async () => {}
    })

    return (
        <FormWrapper
            form={form}
            title={item?.displayName || 'Add'}
            model={item}
            tabList={['General']}>
            <TextField label='Name' name='name' form={form} />
            <TextField label='URL' name='url' form={form} type='url' placeholder='https://' />
            <ImageField form={form} dir='items' />
            <TextareaField fieldName='body' form={form} />
        </FormWrapper>
    )
}

describe('<FormWrapper />', () => {
    let work: WorkModel
    let item: ItemModel
    let addFormWrapper: ReactElement
    let editFormWrapper: ReactElement

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        item = await work.addItem({ name: 'Test Item' })

        addFormWrapper = (
            <MockForm item={undefined} initialValues={{ name: '', body: '', image: '', url: '' }} />
        )
        editFormWrapper = (
            <MockForm
                item={item}
                initialValues={{
                    name: item.name,
                    body: item.body,
                    image: item.body,
                    url: item.url
                }}
            />
        )
    })

    it("doesn't show a tab if there's only one", () => {
        render(addFormWrapper)
        expect(screen.queryByText('component.formWrapper.tab.general')).toBeFalsy()
    })

    it('shows the general and notes tab for an existing item if there are notes to view', async () => {
        expect(screen.queryByText('component.formWrapper.tab.notes')).toBeFalsy()
        const note = await work.addNote({ title: 'Note' })
        await note.updateAssociation(item)
        render(editFormWrapper)
        const noteTab = screen.findByText('component.formWrapper.tab.notes')
        expect(noteTab).toBeTruthy()
    })

    it('shows the images tab for an existing item if there are note images to view', async () => {
        expect(screen.queryByText('component.formWrapper.tab.images')).toBeFalsy()
        const note = await work.addNote({ title: 'Note', image: 'image.jpg' })
        await note.updateAssociation(item)
        render(editFormWrapper)
        const imageTab = await screen.findByText('component.formWrapper.tab.images')
        expect(imageTab).toBeTruthy()
    })
})
