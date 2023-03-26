import Box from '@mui/material/Box'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { ItemDataType } from '@sl/db/models/types'
import ImageField from '@sl/components/form/ImageField'

import { ItemFormProps } from './types'

const ItemForm = ({ work, item, initialValues }: ItemFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        name: yup.string().required(t('form.work.item.name.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable()
    })

    const form: FormikProps<ItemDataType> = useFormik<ItemDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: ItemDataType) => {
            if (initialValues.name) {
                await item.updateItem(values)
            } else {
                item = await work.addItem(values)
                form.resetForm()
            }
            navigate(`/works/${item.work.id}/item/${item.id}`)
        }
    })

    return (
        <FormWrapper
            form={form}
            title={item?.displayName || t('layout.work.panel.item.add')}
            model={item}
            tabList={[t('component.formWrapper.tab.general')]}>
            <Box className='grid grid-cols-2 gap-3 px-3 py-1'>
                <TextField label={t('form.work.item.name.label')} name='name' form={form} />
                <TextareaField fieldName='body' form={form} />
                <TextField
                    label={t('form.work.item.url')}
                    name='url'
                    form={form}
                    type='url'
                    placeholder='https://'
                />
                <ImageField label={t('form.work.item.image')} form={form} dir='items' />
            </Box>
            <></>
        </FormWrapper>
    )
}

export default ItemForm
