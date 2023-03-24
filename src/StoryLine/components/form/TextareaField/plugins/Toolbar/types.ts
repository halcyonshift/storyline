import SceneModel from '@sl/db/models/SectionModel'

export type ToolbarPluginProps = {
    scene: SceneModel
    onSave?: (html: string) => Promise<void>
    setInitialValue: (value: string) => void
}
