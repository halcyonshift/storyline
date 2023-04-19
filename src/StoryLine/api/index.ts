import { ipcRenderer } from 'electron'

export default {
    getCurrentWindow: () => ipcRenderer.invoke('getCurrentWindow'),
    openDialog: (method: string, config: object) => ipcRenderer.invoke('dialog', method, config),
    importImage: (subDir: string) => ipcRenderer.invoke('select-image', subDir),
    imageSrc: (path: string) => ipcRenderer.invoke('show-image', path),
    importFile: (subDir: string) => ipcRenderer.invoke('select-file', subDir),
    importBibisco: () => ipcRenderer.invoke('import-bibisco2'),
    deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path),
    backup: (json: object, images: string[], path: string) =>
        ipcRenderer.invoke('backup', json, images, path),
    selectFilePath: () => ipcRenderer.invoke('select-file-path'),
    exportHTML: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-html', fileName, html),
    exportDocx: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-docx', fileName, html)
}
