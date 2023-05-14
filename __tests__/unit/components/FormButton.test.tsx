import FormButton from '@sl/components/FormButton'
import { render, screen } from '../test-utils'

describe('<FormButton />', () => {
    it('has the correct label', async () => {
        render(<FormButton label='Submit' />)
        expect(screen.getByText('Submit')).toBeTruthy()
    })
})
