/** @format */

import AnnotationModel from '../../../../src/StoryLine/db/models/AnnotationModel'

describe('AnnotationModel', () => {
    it('has annotation table', async () => {
        expect(AnnotationModel.table).toBe('annotation')
    })
})
