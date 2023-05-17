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
        appCopyright: "Hannah O'Malley 2023",
        appVersion: '0.1.1',
        appCategoryType: 'public.app-category.productivity',
        ignore: (file) =>
            file.includes('__tests__') ||
            file.includes('__mocks__') ||
            file.includes('.husky') ||
            file.includes('.vscode') ||
            file.includes('.webpack') ||
            file.includes('coverage') ||
            file.includes('node_modules') ||
            file.includes('out') ||
            file.includes('playwright-report') ||
            file.includes('playwright-results') ||
            file.includes('.env.development') ||
            file.includes('.env.production') ||
            file.includes('.env.test') ||
            file.includes('.eslint.json') ||
            file.includes('.gitignore') ||
            file.includes('.prettierrc.json') ||
            file.includes('babel.config.json') ||
            file.includes('electronegativity.json') ||
            file.includes('forge.config.ts') ||
            file.includes('i18n-unused.config.js') ||
            file.includes('jest.config.js') ||
            file.includes('package.json') ||
            file.includes('playwright.config.js') ||
            file.includes('postcss.config.js') ||
            file.includes('sentry.properties') ||
            file.includes('tailwind.config.js') ||
            file.includes('tsconfig.json') ||
            file.includes('webpack.main.config.ts') ||
            file.includes('webpack.plugins.ts') ||
            file.includes('webpack.renderer.ts') ||
            file.includes('webpack.rules.ts') ||
            file.includes('yarn-error.log') ||
            file.includes('yarn.lock')
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ['darwin']),
        new MakerRpm({}),
        new MakerDeb({})
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-electronegativity',
            config: {
                isSarif: true,
                output: './electronegativity.json'
            }
        },
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
