import { ipcRenderer } from 'electron'
import { Content, Options } from 'epub-gen-memory'

export default {
    backupWork: (json: object, images: string[], path: string) =>
        ipcRenderer.invoke('backup-work', json, images, path),
    restoreWork: () => ipcRenderer.invoke('restore-work'),
    backupDb: (path: string) => ipcRenderer.invoke('backup-db', path),
    restoreDb: () => ipcRenderer.invoke('restore-db'),
    importImage: (subDir: string) => ipcRenderer.invoke('select-image', subDir),
    imageSrc: (path: string) => ipcRenderer.invoke('show-image', path),
    importFile: (subDir: string) => ipcRenderer.invoke('select-file', subDir),
    importBibisco: () => ipcRenderer.invoke('import-bibisco2'),
    deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path),
    selectFilePath: () => ipcRenderer.invoke('select-file-path'),
    exportHTML: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-html', fileName, html),
    exportDocx: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-docx', fileName, html),
    exportEpub: (fileName: string, options: Options, chapters: Content) =>
        ipcRenderer.invoke('export-epub', fileName, options, chapters),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribeToFullScreenEvent: (callback: any) => {
        ipcRenderer.on('full-screen', (_, isFullScreen) => {
            callback(isFullScreen)
        })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unsubscribeFromFullScreenEvent: (callback: any) => {
        ipcRenderer.removeListener('full-screen', (_, isFullScreen) => {
            callback(isFullScreen)
        })
    }
}
