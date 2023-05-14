import { Typography } from '@mui/material'
import userEvent from '@testing-library/user-event'
import Accordion from '@sl/components/Accordion'
import { render, screen } from '../test-utils'

describe('<Accordion />', () => {
    beforeEach(async () => {
        render(
            <Accordion title={<Typography>Title</Typography>}>
                <Typography>Show me</Typography>
            </Accordion>
        )
    })

    it('is closed by default', async () => {
        expect(screen.getByText('Title')).toBeTruthy()
        expect(screen.queryByText('Show me')).toBeFalsy()
    })

    it('opens on title click', async () => {
        await userEvent.click(screen.getByRole('button'))
        expect(screen.getByText('Show me')).toBeTruthy()
    })
})
