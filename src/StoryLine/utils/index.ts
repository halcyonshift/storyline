/** @format */

import parse from 'html-react-parser'

import { htmlExtractExcerptsOptions, htmlParseOptions } from './html'

export const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || ''

export const htmlParse = (s: string) => parse(s, htmlParseOptions)
export const htmlExtractExcerpts = (s: string) => parse(s, htmlExtractExcerptsOptions)

export const wordCount = (s: string) => {
    s = s
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[^A-Za-z0-9 ]/g, '')
        .trim()

    return s !== '' ? s.split(' ').length : 0
}
