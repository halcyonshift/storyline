import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import Gallery from '@sl/components/Gallery'
import { render, screen } from '../test-utils'

describe('<Gallery />', () => {
    it('displays nothing if no images given', () => {
        render(<Gallery images={[]} />)
        expect(screen.queryByAltText('an image')).toBeFalsy()
    })

    it('displays title and subtitle if given', async () => {
        render(
            <Gallery
                images={[{ path: 'image', title: 'An Image', subtitle: 'A subtitle' }]}
                layout='vertical'
            />
        )

        const title = await screen.findByText('An Image')
        const subtitle = await screen.findByText('A subtitle')
        expect(title).toBeTruthy()
        expect(subtitle).toBeTruthy()
    })

    it('navigates forward', async () => {
        render(
            <Gallery
                images={[
                    { path: 'image1.jpg', title: 'Image 1' },
                    { path: 'image2.jpg', title: 'Image 2' }
                ]}
            />
        )

        const next = await screen.findByLabelText('component.gallery.next')

        const image1 = await screen.findByText('Image 1')
        expect(image1).toBeTruthy()

        await userEvent.click(next)

        const image2 = await screen.findByText('Image 2')
        expect(image2).toBeTruthy()

        await userEvent.click(next)

        const image3 = await screen.findByText('Image 1')
        expect(image3).toBeTruthy()
    })

    it('navigates back', async () => {
        render(
            <Gallery
                images={[
                    { path: 'image1.jpg', title: 'Image 1' },
                    { path: 'image2.jpg', title: 'Image 2' }
                ]}
            />
        )

        const back = await screen.findByLabelText('component.gallery.back')

        const image1 = screen.findByText('Image 1')
        expect(image1).toBeTruthy()

        await userEvent.click(back)

        const image2 = screen.findByText('Image 2')
        expect(image2).toBeTruthy()

        await userEvent.click(back)

        const image3 = screen.findByText('Image 1')
        expect(image3).toBeTruthy()
    })

    it('renders correctly', () => {
        const images = [{ path: 'image', title: 'An Image', subtitle: 'A subtitle' }]

        const verticalTree = renderer.create(<Gallery images={images} layout='vertical' />).toJSON()
        expect(verticalTree).toMatchSnapshot()

        const horizontalTree = renderer.create(<Gallery images={images} />).toJSON()
        expect(horizontalTree).toMatchSnapshot()
    })
})
