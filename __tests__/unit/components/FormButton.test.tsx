import renderer from 'react-test-renderer'
import FormButton from '@sl/components/FormButton'
import { render, screen } from '../test-utils'

describe('<FormButton />', () => {
    it('has the correct label', async () => {
        render(<FormButton label='Submit' />)
        expect(screen.getByText('Submit')).toBeTruthy()
    })

    it('renders correctly', () => {
        const tree = renderer.create(<FormButton label='Submit' />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
