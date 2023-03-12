export type RichtextEditorProps = {
    onSave?: (value: string) => Promise<void>
    initialValue?: string
}
