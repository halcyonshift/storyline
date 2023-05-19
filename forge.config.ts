import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

import { version } from './package.json'

const config: ForgeConfig = {
    packagerConfig: {
        icon: './src/StoryLine/assets/images/icons/icon',
        executableName: 'StoryLine',
        appCopyright: "Hannah O'Malley",
        appVersion: version,
        appCategoryType: 'public.app-category.productivity',
        asar: true,
        win32metadata: {
            CompanyName: 'StoryLine',
            OriginalFilename: 'StoryLine'
        }
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel((arch) => ({
            name: 'StoryLine',
            exe: 'storyline.exe',
            noMsi: true,
            setupExe: `storyline-${version}-win32-${arch}-setup.exe`,
            setupIcon: './src/StoryLine/assets/images/icons/icon.ico'
        })),
        new MakerZIP({}, ['darwin']),
        new MakerDMG(
            {
                format: 'ULFO',
                icon: './src/StoryLine/assets/images/icons/icon.icns'
            },
            ['darwin']
        ),
        new MakerRpm(
            {
                options: {
                    icon: './src/StoryLine/assets/images/icons/linux.png'
                }
            },
            ['linux']
        ),
        new MakerDeb(
            {
                options: {
                    icon: './src/StoryLine/assets/images/icons/linux.png'
                }
            },
            ['linux']
        )
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'halcyonshift',
                    name: 'storyline'
                },
                draft: true,
                prerelease: false
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
