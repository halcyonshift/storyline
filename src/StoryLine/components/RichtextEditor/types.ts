import SectionModel from '@sl/db/models/SectionModel'

export type RichtextEditorProps = {
    scene: SectionModel
    onSave: (value: string) => Promise<void>
    initialValue: string
    setInitialValue: (value: string) => void
}
