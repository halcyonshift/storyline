import type { Configuration } from 'webpack'

import { rules } from './webpack.rules'

const isDevelopment = Boolean(process.env.ENVIRONMENT === 'development')

export const mainConfig: Configuration = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.ts',
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
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
