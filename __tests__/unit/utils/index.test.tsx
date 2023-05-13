import {
    wordCount,
    displayDate,
    displayTime,
    displayDateTime,
    sortDate
} from '../../../src/StoryLine/utils'
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

describe('displayDate', () => {
    it('should return a string if no value given', async () => {
        expect(displayDate(null)).toEqual('')
    })

    it('should return the value if the value is not parsable as a date', async () => {
        const date = 'Circa 13AD'
        expect(displayDate(date)).toEqual(date)
    })

    it('should return a formatted date if the value is parsable as a date', async () => {
        expect(displayDate('2001-01-01')).toEqual('Monday 01 Jan 2001')
        expect(displayDate('2001-01-01 08:00:00')).toEqual('Monday 01 Jan 2001')
    })
})

describe('displayTime', () => {
    it('should return a string if no value given', async () => {
        expect(displayTime(null)).toEqual('')
    })

    it('should return the value if the value is not parsable as a time', async () => {
        const time = 'About 3 in the morning'
        expect(displayTime(time)).toEqual(time)
    })

    it('should return a formatted time if the value is parsable as a time', async () => {
        expect(displayTime('08:00:00')).toEqual('8:00')
        expect(displayTime('2001-01-01 08:00:00')).toEqual('8:00')
    })
})

describe('displayDateTime', () => {
    it('should return a string if no value given', async () => {
        expect(displayTime(null)).toEqual('')
    })

    it('should return the value if the value is not parsable as a date time', async () => {
        const dateTime = 'Circa 13AD, about 3 in the morning'
        expect(displayTime(dateTime)).toEqual(dateTime)
    })

    it('should return a formatted date and time if the value is parsable as a date time', async () => {
        expect(displayDateTime('2001-01-01 08:00:00')).toEqual('Monday 01 Jan 2001 8:00')
    })
})

test('wordCount gives correct count', () => {
    expect(wordCount('<p> this is a count of words </p>')).toEqual(6)
})
