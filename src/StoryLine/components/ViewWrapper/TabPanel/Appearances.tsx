import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AppearancesPanelProps } from './types'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const AppearancesPanel = ({ appearances }: AppearancesPanelProps) => {
    const { loadTab } = useTabs()
    const { t } = useTranslation()

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell variant='head'>
                            {t('component.viewWrapper.appearances.th.date')}
                        </TableCell>
                        <TableCell variant='head'>
                            {t('component.viewWrapper.appearances.th.scene')}
                        </TableCell>
                        <TableCell variant='head'>
                            {t('component.viewWrapper.appearances.th.excerpt')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appearances.map((appearance) => (
                        <TableRow
                            key={appearance.scene.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                            <TableCell scope='row'>{appearance.scene.displayDateTime}</TableCell>
                            <TableCell
                                onClick={() => {
                                    loadTab({
                                        id: appearance.scene.id,
                                        mode: 'section'
                                    })
                                }}>
                                {appearance.scene.displayTitle}
                            </TableCell>
                            <TableCell>
                                {appearance.text.map((text) => (
                                    <Typography key={crypto.randomUUID()} variant='body2'>
                                        {text}
                                    </Typography>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default AppearancesPanel
