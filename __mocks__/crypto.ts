jest.mock('crypto', () => {
    return {
        randomUUID: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000')
    }
})