import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ReactDOM from 'react-dom/client'

import theme from './theme'

const dialogConfig = {
    title: 'Select a file',
    buttonLabel: 'This one will do',
    properties: ['openFile']
};


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const Main = () => {
    const handler = () => {
        api.openDialog('showOpenDialog', dialogConfig).then(result => console.log(result))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Typography variant='h1' className='text-center' onClick={handler}>Supp</Typography>
        </ThemeProvider>
    )
}

root.render(
    <Main />
)