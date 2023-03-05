import { NOTE_ICONS } from '@sl/constants/icons'
import { NotePanelProps } from '../types'
import Panel from '..'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotePanel = ({ notes }: NotePanelProps) => {
    return (
        <Panel
            navigation={[
                { link: 'addNote', text: 'layout.work.panel.note.add', icon: NOTE_ICONS.add }
            ]}
        />
    )
}

export default NotePanel
