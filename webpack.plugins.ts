import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import Dotenv from 'dotenv-webpack'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const plugins = [
    new Dotenv(),
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure'
    }),
    new ReactRefreshWebpackPlugin()
]
