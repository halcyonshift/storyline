import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colors: any = resolveConfig(tailwindConfig).theme.colors
