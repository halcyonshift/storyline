import { ElectronApplication, Page, _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import * as eph from 'electron-playwright-helpers'

test.describe('storyline/landing', () => {
    let electronApp: ElectronApplication
    let window: Page

    test.beforeAll(async () => {
        const latestBuild = eph.findLatestBuild()
        const appInfo = eph.parseElectronApp(latestBuild)

        electronApp = await electron.launch({
            args: [appInfo.main],
            executablePath:
                process.env.ENVIRONMENT === 'production' ? appInfo.executable : undefined
        })

        window = await electronApp.firstWindow()
    })

    test('has new link', async () => {
        expect(window.getByText('New')).toBeTruthy()
    })

    test('has import link', async () => {
        expect(window.getByText('Import')).toBeTruthy()
    })

    test('landing screen', async () => {
        await window.screenshot({ path: './playwright-results/landing.png' })
    })

    test.afterAll(async () => {
        // close app
        // await electronApp.close()
    })
})
