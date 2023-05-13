import { wordCount } from '../../../src/StoryLine/utils'
import { render, screen } from '../test-utils'

/*
test('only blockquotes are extracted from html', () => {
    render(
        <div>
            {htmlExtractExcerpts('<blockquote>blockquote text</blockquote><p>paragraph text</p>')}
        </div>
    )
    expect(screen.queryByText('paragraph text')).toBeFalsy()
    expect(screen.getByText('blockquote text')).toBeTruthy()
})

test('links are cleaned from htmlParse', () => {
    render(<div>{htmlExtractExcerpts('<p>paragraph <a href="character">with link</a></p>')}</div>)
    expect(screen.queryByText('character')).toBeFalsy()
})
*/
test('wordCount gives correct count', () => {
    expect(wordCount('<p> this is a count of words </p>')).toEqual(6)
})
