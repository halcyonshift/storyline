import renderer from 'react-test-renderer'
import Icon from '@sl/components/Icon'
import { render, screen } from '../test-utils'

describe('<Icon />', () => {
    it('Shows icon', () => {
        render(<Icon name='Add' />)
        expect(screen.getByLabelText('Add')).toBeTruthy()
    })

    it('renders correctly', () => {
        const tree = renderer.create(<Icon name='Add' />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
