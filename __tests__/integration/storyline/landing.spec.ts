import { ElectronApplication, Page, _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import * as eph from 'electron-playwright-helpers'

test.describe('storyline/landing', () => {
    let electronApp: ElectronApplication
    let page: Page

    test.beforeAll(async () => {
        const latestBuild = eph.findLatestBuild()
        const appInfo = eph.parseElectronApp(latestBuild)

        electronApp = await electron.launch({
            args: [appInfo.main],
            executablePath:
                process.env.ENVIRONMENT === 'production' ? appInfo.executable : undefined
        })

        page = await electronApp.firstWindow()
    })

    test('has new link', () => {
        expect(page.getByText('New')).toBeTruthy()
    })

    test('has import link', () => {
        expect(page.getByText('Import')).toBeTruthy()
    })

    test('has settings link', () => {
        expect(page.getByText('Settings')).toBeTruthy()
    })

    test('has info link', () => {
        expect(page.getByText('Info')).toBeTruthy()
    })

    test('does not have works link', async () => {
        if (process.env.DB_NAME_RANDOM) {
            const pageContent = await page.textContent('body')
            expect(pageContent.includes('Info')).toBeFalsy()
        } else {
            expect(page.getByText('Works')).toBeTruthy()
        }
    })

    test('has works link when work added', async () => {
        await page.getByText('New').click()
        const [button] = await page.$$('button')
        await button.click()
        expect(page.getByText('Works')).toBeTruthy()
    })

    test('screenshot', async () => {
        await page.screenshot({ path: './playwright-results/landing.png' })
    })

    test.afterAll(async () => {
        await electronApp.close()
    })
})
