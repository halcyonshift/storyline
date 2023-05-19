import { useRouteLoaderData } from 'react-router-dom'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ItemModel from '@sl/db/models/ItemModel'
import { htmlParse } from '@sl/utils'
import ViewWrapper from '@sl/components/ViewWrapper'

const ItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel
    const { t } = useTranslation()

    return (
        <ViewWrapper tabList={[t('component.viewWrapper.tab.general')]} model={item}>
            <Box className='py-3'>{htmlParse(item.body)}</Box>
        </ViewWrapper>
    )
}

export default ItemView
