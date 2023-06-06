import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ViewWrapper from '@sl/components/ViewWrapper'
import ItemModel from '@sl/db/models/ItemModel'
import useLayout from '@sl/layouts/Work/useLayout'
import { htmlParse } from '@sl/utils/html'

const ItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(item.displayName)
        setBreadcrumbs([])
    }, [])

    return (
        <ViewWrapper tabList={[t('component.viewWrapper.tab.general')]} model={item}>
            <Box className='py-3'>{htmlParse(item.body)}</Box>
        </ViewWrapper>
    )
}

export default ItemView
