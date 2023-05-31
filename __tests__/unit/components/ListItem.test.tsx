import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import ListItem from '@sl/components/ListItem'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { render, screen } from '../test-utils'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate
}))

describe('<ListItem />', () => {
    it('Displays correct text', () => {
        render(<ListItem link='/' primary='this is text' />)
        expect(screen.getByText('this is text')).toBeTruthy()
    })

    it('Shows icon', () => {
        render(<ListItem link='/' primary='this is text' icon={GLOBAL_ICONS.add} />)
        expect(screen.getByLabelText('Add')).toBeTruthy()
    })

    it('Links as expected', async () => {
        render(<ListItem link='/a-link' primary='this is text' icon={GLOBAL_ICONS.add} />)
        await userEvent.click(screen.getByRole('button'))
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/a-link')
    })

    it('renders correctly', () => {
        const tree = renderer.create(<ListItem link='/' primary='this is text' />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
