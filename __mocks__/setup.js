import { enableFetchMocks } from 'jest-fetch-mock'
import { randomUUID } from 'node:crypto'
enableFetchMocks()


window.crypto.randomUUID = randomUUID

window.api = {
    deleteFile: () => jest.fn(),
    imageSrc: async () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    subscribeToFullScreenEvent: () => jest.fn(),
    unsubscribeFromFullScreenEvent: () => jest.fn()
}
