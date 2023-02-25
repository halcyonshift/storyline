import ReactDOM from 'react-dom/client'

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

    return <h1 className='text-center' onClick={handler}>Supp</h1>
}

root.render(
    <Main />
)