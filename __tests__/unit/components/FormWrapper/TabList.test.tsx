import { TabContext } from '@mui/lab'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import TabList from '@sl/components/FormWrapper/TabList'
import { render, screen } from '../../test-utils'

const mockSetValue = jest.fn()

describe('<TabList />', () => {
    const tabList = (
        <TabContext value='1'>
            <TabList
                setValue={mockSetValue}
                tabList={['General', 'Other']}
                errorBadges={{}}
                notes={[]}
            />
        </TabContext>
    )

    beforeAll(() => {
        render(tabList)
    })

    it('calls setValue on tab press', async () => {
        await userEvent.click(screen.getAllByRole('tab')[1])
        expect(mockSetValue).toBeCalledWith('2')
    })

    it('shows error badges', async () => {
        const { container } = render(
            <TabContext value='1'>
                <TabList
                    setValue={mockSetValue}
                    tabList={['General', 'Other']}
                    errorBadges={{ '1': 2 }}
                    notes={[]}
                />
            </TabContext>
        )
        expect(container.getElementsByClassName('MuiBadge-colorError').length).toBe(1)
    })

    it('renders correctly', () => {
        const tree = renderer.create(tabList).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
