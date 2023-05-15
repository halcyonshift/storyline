import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import { Status as Options } from '@sl/constants/status'
import Status from '@sl/components/Status'
import database from '@sl/db'
import { ItemModel, WorkModel } from '@sl/db/models'
import { render, screen } from '../test-utils'

describe('<Status />', () => {
    let work: WorkModel
    let item: ItemModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        item = await work.addItem({ name: 'Test Item' })

        render(<Status model={item} />)
    })

    it('it updates the model status on click', async () => {
        const buttons = screen.getAllByRole('button')

        await userEvent.click(buttons[0])
        expect(item.status).toBe(Options.TODO)

        await userEvent.click(buttons[1])
        expect(item.status).toBe(Options.DRAFT)

        await userEvent.click(buttons[2])
        expect(item.status).toBe(Options.REVIEW)

        await userEvent.click(buttons[3])
        expect(item.status).toBe(Options.COMPLETE)

        await userEvent.click(buttons[4])
        expect(item.status).toBe(Options.ARCHIVE)
    })

    it('renders correctly', () => {
        const tree = renderer.create(<Status model={item} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
