import userEvent from '@testing-library/user-event'
import { useFormik } from 'formik'
import renderer from 'react-test-renderer'
import ColorField from '@sl/components/form/ColorField'
import { render, screen } from '../../test-utils'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate
}))

const MockColorField = ({ name, label }: { name?: string; label: string }) => {
    const form = useFormik({
        initialValues: { [name]: '#FF0000' },
        onSubmit: async () => {}
    })

    return <ColorField form={form} name={name} label={label} />
}

describe('<ColorField />', () => {
    it('shows the given label', () => {
        render(<MockColorField label='Color Field' />)
        expect(screen.getByText('Color Field')).toBeTruthy()
    })

    it('it clears on click', async () => {
        render(<MockColorField label='Color Field' />)
        await userEvent.click(screen.getAllByRole('button')[1])
        expect(screen.queryByDisplayValue('#FF0000')).toBeFalsy()
    })

    it('it shows popover on click', async () => {
        render(<MockColorField label='Color Field' />)
        expect(screen.queryByRole('presentation')).toBeFalsy()
        await userEvent.click(screen.getAllByRole('button')[0])
        expect(screen.getByRole('presentation')).toBeTruthy()
    })

    it('renders correctly', () => {
        const tree = renderer.create(<MockColorField label='Color Field' />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
