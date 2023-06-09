import { WebpackPluginInstance } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { StatsWriterPlugin } from 'webpack-stats-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const isDevelopment = Boolean(process.env.ENVIRONMENT === 'development')
const isCI = Boolean(process.env.CIRCLE)
const isProduction = Boolean(!isDevelopment && !isCI)

const getEnvFile = () => {
    if (isDevelopment) return './.env.development'
    if (isCI) return './.env.ci'
    if (isProduction) return './.env.production'
}

export const plugins = [
    new Dotenv({
        path: getEnvFile()
    }) as WebpackPluginInstance,
    isDevelopment &&
        new ForkTsCheckerWebpackPlugin({
            logger: 'webpack-infrastructure'
        }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    isProduction && new BundleAnalyzerPlugin(),
    isProduction &&
        new StatsWriterPlugin({
            filename: 'stats.json',
            fields: null
        })
].filter(Boolean) as WebpackPluginInstance[]
