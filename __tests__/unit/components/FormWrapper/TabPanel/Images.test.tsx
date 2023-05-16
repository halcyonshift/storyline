import renderer from 'react-test-renderer'
import Images from '@sl/components/FormWrapper/TabPanel/Images'

describe('<TabPanel.Images />', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Images notes={[]} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
