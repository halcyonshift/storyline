import userEvent from '@testing-library/user-event'
import RichtextEditor from '@sl/components/RichtextEditor'
import database from '@sl/db'
import { SectionModel, WorkModel } from '@sl/db/models'
import { render, screen, waitFor } from '../../test-utils'

const mockOnSave = jest.fn()

let mockWork: WorkModel
let mockSection: SectionModel

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useRouteLoaderData: (mode: string) => {
        if (mode === 'work') return mockWork
        return mockSection
    }
}))

describe('<RichtextEditor />', () => {
    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        mockWork = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        mockSection = await mockWork.addPart()

        render(
            <RichtextEditor
                id='test'
                onSave={mockOnSave}
                initialValue='<p>Initial text</p>'
                toolbar={['excerpt', 'tag', 'search', 'save']}
            />
        )
    })

    it('saves onClick', async () => {
        await userEvent.click(screen.getByLabelText('component.richtextEditor.toolbar.save'))
        await waitFor(() => expect(mockOnSave).toHaveBeenCalled())
    })
})
