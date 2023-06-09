import { WebpackPluginInstance } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const getEnvFile = () => {
    if (process.env.ENVIRONMENT === 'development') return './.env.development'
    if (process.env.CIRCLE) return './.env.ci'
    return './.env.production'
}

console.log('getEnvFile', getEnvFile())

export const plugins = [
    new Dotenv({
        path: getEnvFile()
    }) as WebpackPluginInstance,
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure'
    }),
    new ReactRefreshWebpackPlugin()
]
