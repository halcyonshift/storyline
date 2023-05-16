import renderer from 'react-test-renderer'
import Notes from '@sl/components/FormWrapper/TabPanel/Notes'

describe('<TabPanel.Notes />', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Notes notes={[]} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
