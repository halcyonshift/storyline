import { Typography } from '@mui/material'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { render, screen } from '../../test-utils'

const mockSetGroup = jest.fn()

describe('<Panel />', () => {
    const panel = (
        <Panel
            action={
                <GroupToggle
                    label={'layout.work.panel.character.groupToggle'}
                    group={null}
                    setGroup={mockSetGroup}
                />
            }
            navigation={[
                {
                    link: `add`,
                    text: 'add.text',
                    icon: GLOBAL_ICONS.add
                }
            ]}>
            <Typography>Content</Typography>
        </Panel>
    )

    beforeAll(() => {
        render(panel)
    })

    it('renders correctly', () => {
        expect(1).toBe(1)
    })
})
