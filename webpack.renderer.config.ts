import type { Configuration } from 'webpack'
import path from 'path'

import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }]
})

export const rendererConfig: Configuration = {
    module: {
        rules
    },
    devtool: 'source-map',
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
