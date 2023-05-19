import { ProvidePlugin, WebpackPluginInstance } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

export const plugins = [
    new Dotenv() as unknown as WebpackPluginInstance,
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure'
    }),
    new ReactRefreshWebpackPlugin(),
    new ProvidePlugin({
        __importStar: ['tslib', '__importStar']
    })
]
