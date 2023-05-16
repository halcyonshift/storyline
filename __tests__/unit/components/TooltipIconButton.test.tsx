import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { render, screen } from '../test-utils'

const onClick = jest.fn()
const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate
}))

describe('<TooltipIconButton />', () => {
    it('has the correct text and icon', async () => {
        render(<TooltipIconButton text='The text' icon={GLOBAL_ICONS.add} />)
        expect(screen.getByLabelText('The text')).toBeTruthy()
        expect(screen.getByLabelText('Add')).toBeTruthy()
    })

    it('navigates to the correct link', async () => {
        render(<TooltipIconButton text='The text' icon={GLOBAL_ICONS.add} link='/a-link' />)
        await userEvent.click(screen.getByRole('button'))
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/a-link')
    })

    it('handles the onClick with no confirm', async () => {
        render(<TooltipIconButton text='The text' icon={GLOBAL_ICONS.add} onClick={onClick} />)
        await userEvent.click(screen.getByRole('button'))
        expect(onClick).toHaveBeenCalled()
    })

    it('handles the onClick with confirm', async () => {
        render(
            <TooltipIconButton
                text='The text'
                icon={GLOBAL_ICONS.add}
                onClick={onClick}
                link='/a-link'
                confirm='CONFIRM'
            />
        )
        const closedButtons = await screen.findAllByRole('button')
        expect(closedButtons.length).toBe(1)

        await userEvent.click(screen.getByRole('button'))
        const dialog = await screen.findByText('CONFIRM')

        expect(dialog).toBeTruthy()

        const openButtons = await screen.findAllByRole('button')
        await userEvent.click(openButtons[2])

        expect(onClick).toHaveBeenCalled()
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/a-link')
    })

    it('renders correctly', () => {
        const tree = renderer
            .create(
                <TooltipIconButton
                    text='The text'
                    icon={GLOBAL_ICONS.add}
                    onClick={onClick}
                    link='/a-link'
                    confirm='CONFIRM'
                />
            )
            .toJSON()
        expect(tree).toMatchSnapshot()
    })
})
