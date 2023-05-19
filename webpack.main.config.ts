import type { Configuration } from 'webpack'

import { rules } from './webpack.rules'

export const mainConfig: Configuration = {
    entry: './src/index.ts',
    devtool: process.env.DEVTOOL || 'source-map',
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    },
    module: {
        rules
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
    }
}
