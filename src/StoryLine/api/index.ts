import { ipcRenderer } from 'electron'

export default {
    // ToDo - remove if not useful later
    getCurrentWindow: () => ipcRenderer.invoke('getCurrentWindow'),
    openDialog: (method: string, config: object) => ipcRenderer.invoke('dialog', method, config),
    importImage: (subDir: string) => ipcRenderer.invoke('select-image', subDir),
    imageSrc: (path: string) => ipcRenderer.invoke('show-image', path),
    importFile: (subDir: string) => ipcRenderer.invoke('select-file', subDir),
    importBibisco: () => ipcRenderer.invoke('import-bibisco2'),
    deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path)
}
