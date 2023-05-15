import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import Selector from '@sl/components/Selector'
import { render, screen } from '../test-utils'

const onClick = jest.fn()

describe('<Selector />', () => {
    beforeAll(() => {
        render(<Selector onClick={onClick} />)
    })

    it('it updates active table on click', async () => {
        const buttons = screen.getAllByRole('button')

        await userEvent.click(buttons[0])
        expect(onClick).toHaveBeenCalledWith('character')

        await userEvent.click(buttons[1])
        expect(onClick).toHaveBeenCalledWith('location')

        await userEvent.click(buttons[2])
        expect(onClick).toHaveBeenCalledWith('item')

        await userEvent.click(buttons[3])
        expect(onClick).toHaveBeenCalledWith('note')
    })

    it('renders correctly', () => {
        const tree = renderer.create(<Selector onClick={onClick} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
