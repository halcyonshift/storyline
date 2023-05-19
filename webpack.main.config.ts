import type { Configuration } from 'webpack'

import { rules } from './webpack.rules'

export const mainConfig: Configuration = {
    entry: './src/index.ts',
    devtool: 'source-map',
    module: {
        rules
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
    }
}
