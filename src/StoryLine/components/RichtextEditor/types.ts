export type RichtextEditorProps = {
    id: string
    onSave?: (value: string) => Promise<void>
    initialValue?: string
}
