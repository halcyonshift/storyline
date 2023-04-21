import { ipcRenderer } from 'electron'

export default {
    importImage: (subDir: string) => ipcRenderer.invoke('select-image', subDir),
    imageSrc: (path: string) => ipcRenderer.invoke('show-image', path),
    importFile: (subDir: string) => ipcRenderer.invoke('select-file', subDir),
    importBibisco: () => ipcRenderer.invoke('import-bibisco2'),
    deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path),
    backup: (json: object, images: string[], path: string) =>
        ipcRenderer.invoke('backup', json, images, path),
    restore: () => ipcRenderer.invoke('restore'),
    selectFilePath: () => ipcRenderer.invoke('select-file-path'),
    exportHTML: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-html', fileName, html),
    exportDocx: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-docx', fileName, html)
}
