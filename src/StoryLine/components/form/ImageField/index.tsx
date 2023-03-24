import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Image from '@sl/components/Image'
import { ImageFieldProps } from './types'
import { useTranslation } from 'react-i18next'

const ImageField = ({ form, label, dir }: ImageFieldProps) => {
    const { t } = useTranslation()
    const [path, setPath] = useState<string>('')

    useEffect(() => {
        setPath(form.values.image)
    }, [form.values.image])

    const importImage = async () => {
        const result = await api.importImage(dir)
        form.setFieldValue('image', result)
    }

    const deleteImage = () => {
        if (!form.values.image) return
        api.deleteFile(form.values.image)
        form.setFieldValue('image', '')
    }

    return (
        <>
            <InputLabel className='mb-1'>{label}</InputLabel>
            <Box className='border p-1 bg-white relative'>
                <Box className='bg-slate-100 min-h-[50px]'>
                    <Image path={path} width='w-auto' />
                </Box>
                <Box className='absolute bg-white bottom-0 left-0 rounded-tr-lg'>
                    <Button onClick={importImage}>{t('component.imageField.browse')}</Button>
                    {form.values.image ? (
                        <Button onClick={deleteImage}>{t('component.imageField.delete')}</Button>
                    ) : null}
                </Box>
            </Box>
        </>
    )
}

export default ImageField