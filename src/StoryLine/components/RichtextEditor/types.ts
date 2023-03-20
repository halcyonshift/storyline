import SectionModel from '@sl/db/models/SectionModel'

export type RichtextEditorProps = {
    id: string
    onSave: (value: string) => Promise<void>
    initialValue: string
}
