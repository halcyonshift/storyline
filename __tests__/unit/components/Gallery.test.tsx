import { Typography } from '@mui/material'
import userEvent from '@testing-library/user-event'
import Gallery from '@sl/components/Gallery'
import { render, screen } from '../test-utils'

describe('<Gallery />', () => {
    it('displays nothing if no images given', () => {
        render(<Gallery images={[]} />)
        expect(screen.queryByAltText('an image')).toBeFalsy()
    })

    it('displays title and subtitle if given', () => {
        render(
            <Gallery
                images={[{ path: 'image', title: 'An Image', subtitle: 'A subtitle' }]}
                layout='vertical'
            />
        )
        expect(screen.getByText('An Image')).toBeTruthy()
        expect(screen.getByText('A subtitle')).toBeTruthy()
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
        const next = screen.getByLabelText('component.gallery.next')
        expect(screen.getByText('Image 1')).toBeTruthy()
        await userEvent.click(next)
        expect(screen.getByText('Image 2')).toBeTruthy()
        await userEvent.click(next)
        expect(screen.getByText('Image 1')).toBeTruthy()
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
        const back = screen.getByLabelText('component.gallery.back')
        expect(screen.getByText('Image 1')).toBeTruthy()
        await userEvent.click(back)
        expect(screen.getByText('Image 2')).toBeTruthy()
        await userEvent.click(back)
        expect(screen.getByText('Image 1')).toBeTruthy()
    })
})
