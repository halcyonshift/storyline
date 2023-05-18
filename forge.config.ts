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
        appVersion: '0.1.2',
        appCategoryType: 'public.app-category.productivity',
        asar: true
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ['darwin']),
        new MakerRpm({}),
        new MakerDeb({})
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'halcyonshift',
                    name: 'storyline'
                },
                prerelease: true
            }
        }
    ],
    plugins: [
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
