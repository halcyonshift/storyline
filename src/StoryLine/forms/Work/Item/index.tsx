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
import useMessenger from '@sl/layouts/useMessenger'
import { ItemFormProps } from './types'

const ItemForm = ({ work, item, initialValues }: ItemFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const messenger = useMessenger()

    const validationSchema = yup.object({
        name: yup.string().required(t('form.work.item.name.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable()
    })

    const form: FormikProps<ItemDataType> = useFormik<ItemDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: ItemDataType) => {
            if (initialValues.name) {
                await item.updateRecord(values)
                messenger.success(t('form.work.item.alert.success'))
            } else {
                item = await work.addItem(values)
                form.resetForm()
                navigate(`/work/${item.work.id}/item/${item.id}`)
                messenger.success(t('form.work.item.alert.success'))
            }
        }
    })

    return (
        <FormWrapper
            form={form}
            title={item?.displayName || t('layout.work.panel.item.add')}
            model={item}
            tabList={[t('component.formWrapper.tab.general')]}>
            <>
                <Box className='grid grid-cols-2 gap-3 mb-1'>
                    <Box className='grid grid-cols-1 gap-3'>
                        <TextField label={t('form.work.item.name.label')} name='name' form={form} />
                        <TextField
                            label={t('form.work.item.url')}
                            name='url'
                            form={form}
                            type='url'
                            placeholder='https://'
                        />
                    </Box>
                    <Box>
                        <ImageField form={form} dir='items' />
                    </Box>
                </Box>
                <TextareaField fieldName='body' form={form} />
            </>
        </FormWrapper>
    )
}

export default ItemForm
