import { WebpackPluginInstance } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

export const plugins = [
    new Dotenv(
        process.env.CIRCLE && parseInt(process.env.CIRCLE) !== 1
            ? {
                  path: `./.env.${
                      process.env.ENVIRONMENT === 'development' ? 'development' : 'production'
                  }`
              }
            : {}
    ) as unknown as WebpackPluginInstance,
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure'
    }),
    new ReactRefreshWebpackPlugin()
]
