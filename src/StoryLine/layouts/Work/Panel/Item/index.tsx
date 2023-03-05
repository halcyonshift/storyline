import { ITEM_ICONS } from '@sl/constants/icons'
import { ItemPanelProps } from '../types'
import Panel from '../'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ItemPanel = ({ items }: ItemPanelProps) => {
    return (
        <Panel
            navigation={[
                { link: 'addItem', text: 'layout.work.panel.item.add', icon: ITEM_ICONS.add }
            ]}
        />
    )
}

export default ItemPanel
