import { dialog } from 'electron'

export const confirmationDialog = async () => {
    const response = await dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Yes'],
        defaultId: 1,
        title: 'Confirmation',
        message: "There's no malware check - is this file from a trusted source?"
    })

    return Boolean(response.response === 1)
}
