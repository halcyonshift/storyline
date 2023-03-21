import parse from 'html-react-parser'
import { DateTime } from 'luxon'

import { htmlExtractExcerptsOptions, htmlParseOptions } from './html'

export const htmlParse = (s: string) => parse(s, htmlParseOptions)
export const htmlExtractExcerpts = (s: string) => parse(s, htmlExtractExcerptsOptions)

export const dateFormat = (jsDate: Date) => {
    return DateTime.fromJSDate(jsDate).toLocaleString(DateTime.DATETIME_SHORT)
}

export const wordCount = (s: string) => {
    s = s
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[^A-Za-z0-9 ]/g, '')
        .trim()

    return s !== '' ? s.split(' ').length : 0
}
