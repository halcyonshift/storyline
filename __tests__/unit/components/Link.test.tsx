import Link from '@sl/components/Link'
import { render, screen } from '../test-utils'

describe('<Link />', () => {
    beforeAll(() => {
        render(<Link href='/'>A Link</Link>)
    })

    it('has the correct text', () => {
        expect(screen.getByText('A Link')).toBeTruthy()
    })
})
