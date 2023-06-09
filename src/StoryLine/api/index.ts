import { ipcRenderer } from 'electron'
import { Content, Options } from 'epub-gen-memory'

export default {
    setTitle: (title: string) => ipcRenderer.invoke('set-title', title),
    shouldUseDarkColors: () => ipcRenderer.invoke('should-use-dark-colors'),
    backupStoryLine: (jsonString: string) => ipcRenderer.invoke('backup-storyline', jsonString),
    backupWork: (json: object, images: string[], path: string) =>
        ipcRenderer.invoke('backup-work', json, images, path),
    restoreStoryLine: () => ipcRenderer.invoke('restore-storyline'),
    restoreWork: () => ipcRenderer.invoke('restore-work'),
    importImage: (subDir: string) => ipcRenderer.invoke('select-image', subDir),
    importFile: (subDir: string) => ipcRenderer.invoke('select-file', subDir),
    importAo3: (id: number, mode: 'series' | 'work') => ipcRenderer.invoke('import-ao3', id, mode),
    importBibisco: () => ipcRenderer.invoke('import-bibisco2'),
    importEPub: () => ipcRenderer.invoke('import-epub'),
    imageSrc: (path: string) => ipcRenderer.invoke('show-image', path),
    deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path),
    selectFilePath: () => ipcRenderer.invoke('select-file-path'),
    exportDocx: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-docx', fileName, html),
    exportEpub: (fileName: string, options: Options, chapters: Content) =>
        ipcRenderer.invoke('export-epub', fileName, options, chapters),
    exportHTML: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-html', fileName, html),
    exportMarkdown: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-markdown', fileName, html),
    exportRTF: (fileName: string, html: string) => ipcRenderer.invoke('export-rtf', fileName, html),
    exportText: (fileName: string, html: string) =>
        ipcRenderer.invoke('export-text', fileName, html),
    relaunch: () => ipcRenderer.invoke('relaunch'),
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
