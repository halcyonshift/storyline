/** @format */

import { createTheme } from '@mui/material/styles'
import { orange } from '@mui/material/colors'

const light = createTheme({
    status: {
        danger: orange[500]
    }
})

const dark = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2'
        }
    },
    status: {
        danger: orange[500]
    }
})

export default { light, dark }
