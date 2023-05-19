import { init } from '@sentry/electron/renderer'
import { init as reactInit } from '@sentry/react'

if (parseInt(process.env.MONITOR) === 1) {
    init({ dsn: process.env.SENTRY_DSN }, reactInit)
}

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'
import './StoryLine'
