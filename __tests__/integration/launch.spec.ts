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
            executablePath: appInfo.executable
        })

        window = await electronApp.firstWindow()
    })

    test('isPackaged', async () => {
        const isPackaged = await electronApp.evaluate(async ({ app }) => {
            return app.isPackaged
        })

        expect(isPackaged).toBe(process.env.ENVIRONMENT === 'production')
    })

    test('screenshot', async () => {
        await window.screenshot({ path: './playwright-results/launch.png' })
    })

    test.afterAll(async () => {
        await electronApp.close()
    })
})
