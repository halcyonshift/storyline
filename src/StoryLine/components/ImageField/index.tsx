import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Image from '@sl/components/Image'
import { ImageFieldProps } from './types'
import { useTranslation } from 'react-i18next'

const ImageField = ({ form }: ImageFieldProps) => {
    const { t } = useTranslation()
    const [path, setPath] = useState<string>('')

    useEffect(() => {
        setPath(form.values.image)
    }, [form.values.image])

    const importImage = async () => {
        const result = await api.importImage('locations')
        form.setFieldValue('image', result)
    }

    const deleteImage = () => {
        if (!form.values.image) return
        api.deleteFile(form.values.image)
        form.setFieldValue('image', '')
    }

    return (
        <Stack direction='row' spacing={2}>
            <Image path={path} width='100px' />
            <Stack spacing={2}>
                <Button onClick={importImage}>{t('component.imageField.browse')}</Button>
                {form.values.image ? (
                    <Button onClick={deleteImage}>{t('component.imageField.delete')}</Button>
                ) : null}
            </Stack>
        </Stack>
    )
}

export default ImageField
