import { List, ListItem } from '@mui/material'
import Link from '@sl/components/Link'
import { prettyUrl } from '@sl/utils'
import { LinksPanelProps } from './types'

const LinksPanel = ({ links }: LinksPanelProps) => (
    <List disablePadding>
        {links.map((link, index) => (
            <ListItem key={`link-${index}`} divider>
                <Link href={link}>{prettyUrl(link)}</Link>
            </ListItem>
        ))}
    </List>
)

export default LinksPanel
