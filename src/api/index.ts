import { ipcRenderer } from 'electron'

export default {
    openDialog: (method: string, config: object) => ipcRenderer.invoke('dialog', method, config)
}
