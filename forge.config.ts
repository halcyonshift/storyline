import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

const config: ForgeConfig = {
    packagerConfig: {
        icon: './src/StoryLine/assets/images/icon',
        appCopyright: "Hannah O'Malley",
        appVersion: '0.1.1',
        appCategoryType: 'public.app-category.productivity',
        asar: true,
        ignore: [
            /^\/__tests__(\/|$)/,
            /^\/__mocks__(\/|$)/,
            /^\/\.git(\/|$)/,
            /^\/\.husky(\/|$)/,
            /^\/\.vscode(\/|$)/,
            /^\/coverage(\/|$)/,
            /^\/playwright-report(\/|$)/,
            /^\/playwright-results(\/|$)/,
            /^\/src\/StoryLine\/db\/__mocks__(\/|$)/,
            /^\/\.env\.development$/,
            /^\/\.env\.production$/,
            /^\/\.env\.test$/,
            /^\/\.gitignore$/,
            /^\/babel.config.json$/,
            /^\/electronegativity.json$/,
            /^\/jest.config.js$/,
            /^\/sentry.properties$/,
            /^\/tailwind.config.js$/,
            /^\/tsconfig.json$/
        ]
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ['darwin']),
        new MakerRpm({}),
        new MakerDeb({})
    ],
    plugins: [
        /*
        {
            name: '@electron-forge/plugin-electronegativity',
            config: {
                isSarif: true,
                output: './electronegativity.json'
            }
        },
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {}
        },
        */
        new WebpackPlugin({
            devServer: {
                hot: true,
                liveReload: false
            },
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/index.html',
                        js: './src/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/preload.ts',
                            config: {
                                ...rendererConfig,
                                plugins: []
                            }
                        }
                    }
                ]
            }
        })
    ]
}

export default config
