import { Typography } from '@mui/material'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import Accordion from '@sl/components/Accordion'
import { render, screen } from '../test-utils'

describe('<Accordion />', () => {
    const accordion = (
        <Accordion id='1' title={<Typography>Title</Typography>}>
            <Typography>Show me</Typography>
        </Accordion>
    )
    beforeEach(async () => {
        render(accordion)
    })

    it('is closed by default', async () => {
        expect(screen.getByText('Title')).toBeTruthy()
        expect(screen.queryByText('Show me')).toBeFalsy()
    })

    it('opens on title click', async () => {
        await userEvent.click(screen.getByRole('button'))
        expect(screen.getByText('Show me')).toBeTruthy()
    })

    it('renders correctly', () => {
        const tree = renderer.create(accordion).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
