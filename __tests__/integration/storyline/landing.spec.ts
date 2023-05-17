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
            executablePath: appInfo.executable
        })

        page = await electronApp.firstWindow()
    })

    test('does not have works link', async () => {
        if (process.env.DB_NAME_RANDOM) {
            const pageContent = await page.textContent('body')
            expect(pageContent.includes('Info')).toBeFalsy()
        } else {
            expect(page.getByText('Works')).toBeTruthy()
        }
    })

    test('has new link', () => {
        expect(page.getByText('New')).toBeTruthy()
    })

    test('has works link when new link clicked', async () => {
        await page.getByText('New').click()
        const [button] = await page.$$('button')
        await button.click()
        expect(page.getByText('Works')).toBeTruthy()
    })

    test('lists works when works link clicked', async () => {
        await page.getByText('Works').click()
        const tr = await page.$$('tbody tr')
        expect(tr.length).toBe(1)

        const td = await page.$$('tbody td')
        expect(td[0].textContent()).toBe('0')

        const buttons = await page.$$('button')

        await buttons[1].click()
        expect(page.url()).toContain('/#work')

        await buttons[0].click()

        await buttons[2].click()
        expect(page.getByText).toContain('Are you sure?')

        await buttons[0].click()
    })

    test('has import link', async () => {
        await page.getByText('Import').click()
        expect(page.url()).toContain('/#import')
    })

    test('has settings link', () => {
        expect(page.getByText('Settings')).toBeTruthy()
    })

    test('has info link', () => {
        expect(page.getByText('Info')).toBeTruthy()
    })

    test('screenshot', async () => {
        await page.screenshot({ path: './playwright-results/landing.png' })
    })

    test.afterAll(async () => {
        await electronApp.close()
    })
})
