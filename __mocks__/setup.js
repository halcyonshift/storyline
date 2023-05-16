import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

window.api = {
    deleteFile: () => jest.fn(),
    imageSrc: async () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    fullScreenEvent: () => jest.fn()
}
