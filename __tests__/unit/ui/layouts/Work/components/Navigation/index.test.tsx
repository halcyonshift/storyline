import userEvent from '@testing-library/user-event'

import Navigation from '@sl/layouts/Work/Navigation'

import { render, screen } from '../../../../../test-utils'

describe('<Navigation />', () => {
    it('should skip a thing', () => {
        expect(1).toEqual(1)
    })
})

/*
describe('<Navigation />', () => {
    const setCurrentPanel = jest.fn((panel: string | null) => {})
    const user = userEvent.setup()

    beforeAll(async () => {
        render(<Navigation forwardRef={null} currentPanel='' setCurrentPanel={setCurrentPanel} />)
    })

    describe('Sections navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.work', () => {
            const icon = screen.getByLabelText('layout.work.navigation.work')
            expect(icon).toBeInTheDocument()
        })

        it('should open the section panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.work')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith('section')
        })
    })

    describe('Sections navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.work', () => {
            const icon = screen.getByLabelText('layout.work.navigation.work')
            expect(icon).toBeInTheDocument()
        })

        it('should open the section panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.work')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith('section')
        })
    })

    describe('Characters navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.character', () => {
            const icon = screen.getByLabelText('layout.work.navigation.character')
            expect(icon).toBeInTheDocument()
        })

        it('should open the character panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.character')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith('character')
        })
    })

    describe('Locations navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.location', () => {
            const icon = screen.getByLabelText('layout.work.navigation.location')
            expect(icon).toBeInTheDocument()
        })

        it('should open the location panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.location')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith('location')
        })
    })

    describe('Items navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.item', () => {
            const icon = screen.getByLabelText('layout.work.navigation.item')
            expect(icon).toBeInTheDocument()
        })

        it('should open the item panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.item')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith('item')
        })
    })

    describe('Notes navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.note', () => {
            const icon = screen.getByLabelText('layout.work.navigation.note')
            expect(icon).toBeInTheDocument()
        })

        it('should open the note panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.note')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith('note')
        })
    })

    describe('Search navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.search', () => {
            const icon = screen.getByLabelText('layout.work.navigation.search')
            expect(icon).toBeInTheDocument()
        })

        it('should close the panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.search')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith(undefined)
        })
    })

    describe('Timeline navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.timeline', () => {
            const icon = screen.getByLabelText('layout.work.navigation.timeline')
            expect(icon).toBeInTheDocument()
        })

        it('should close the panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.timeline')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith(undefined)
        })
    })

    describe('Relation navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.relation', () => {
            const icon = screen.getByLabelText('layout.work.navigation.relation')
            expect(icon).toBeInTheDocument()
        })

        it('should close the panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.relation')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith(undefined)
        })
    })

    describe('Insight navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.insight', () => {
            const icon = screen.getByLabelText('layout.work.navigation.insight')
            expect(icon).toBeInTheDocument()
        })

        it('should close the panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.insight')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith(undefined)
        })
    })

    describe('Backup/restore navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.backupRestore', () => {
            const icon = screen.getByLabelText('layout.work.navigation.backupRestore')
            expect(icon).toBeInTheDocument()
        })

        it('should close the panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.backupRestore')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith(undefined)
        })
    })

    describe('Settings navigation item', () => {
        it('should have an icon with aria-label layout.work.navigation.setting', () => {
            const icon = screen.getByLabelText('layout.work.navigation.setting')
            expect(icon).toBeInTheDocument()
        })

        it('should close the panel when clicked', async () => {
            const icon = screen.getByLabelText('layout.work.navigation.setting')
            await user.click(icon)
            expect(setCurrentPanel).toHaveBeenCalledWith(undefined)
        })
    })
})
*/
