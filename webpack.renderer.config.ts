import type { Configuration } from 'webpack'
import path from 'path'

import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'

const isDevelopment = Boolean(process.env.ENVIRONMENT === 'development')

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }]
})

export const rendererConfig: Configuration = {
    mode: isDevelopment ? 'development' : 'production',
    module: {
        rules
    },
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    },
    plugins,
    externals: {
        electron: 'commonjs electron'
    },
    resolve: {
        alias: {
            '@sl': path.resolve(__dirname, './src/StoryLine')
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
    }
}
