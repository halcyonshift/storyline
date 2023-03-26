import { NoteModel } from '@sl/db/models'
import { FormikProps } from 'formik'

export type TabPanelProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: FormikProps<any>
    notes: NoteModel[]
}
