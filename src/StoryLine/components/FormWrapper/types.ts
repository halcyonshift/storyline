import { ReactElement } from 'react'
import { NoteModel } from '@sl/db/models'
import { FormikProps } from 'formik'

export type FormWrapperProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormikProps<any>
    title?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: any
    header?: ReactElement
    children: ReactElement | ReactElement[]
    tabList: string[]
    notes: NoteModel[]
}
