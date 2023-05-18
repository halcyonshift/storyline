import renderer from 'react-test-renderer'
import Progress from '@sl/components/Progress'
import { render, screen } from '../test-utils'

describe('<Progress />', () => {
    it('is green if percentage 100%', () => {
        render(<Progress words={100} goal={100} />)
        expect(screen.getByRole('progressbar')).toHaveClass('MuiLinearProgress-colorSuccess')
    })

    it('is blue if percentage below 100%', () => {
        render(<Progress words={75} goal={100} />)
        expect(screen.getByRole('progressbar')).toHaveClass('MuiLinearProgress-colorInfo')
    })

    it('is orange if percentage below 75%', () => {
        render(<Progress words={50} goal={100} />)
        expect(screen.getByRole('progressbar')).toHaveClass('MuiLinearProgress-colorWarning')
    })

    it('is orange if percentage below 50%', () => {
        render(<Progress words={49} goal={100} />)
        expect(screen.getByRole('progressbar')).toHaveClass('MuiLinearProgress-colorError')
    })

    it("doesn't display if no goal ", () => {
        render(<Progress words={100} goal={0} />)
        expect(screen.queryByRole('progressbar')).toBeFalsy()
    })

    it('renders correctly', () => {
        const tree = renderer.create(<Progress words={100} goal={1000} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
