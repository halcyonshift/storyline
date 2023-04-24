import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import { htmlExtractExcerptsOptions, htmlParseOptions } from './html'

export const autoCompleteOptions = (data: { id: string; displayName: string }[]) => {
    return data.map((item) => ({ id: item.id, label: item.displayName }))
}
export const dateFormat = (jsDate: Date) => {
    return DateTime.fromJSDate(jsDate).toLocaleString(DateTime.DATETIME_SHORT)
}
export const htmlParse = (s: string) => parse(s, htmlParseOptions)
export const htmlExtractExcerpts = (s: string) => parse(s, htmlExtractExcerptsOptions)

export const stringToColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += ('00' + value.toString(16)).slice(-2)
    }
    return colour
}

export const wordCount = (s: string) => {
    s = s
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[^A-Za-z0-9 ]/g, '')
        .trim()

    return s !== '' ? s.split(' ').length : 0
}

export const prettyUrl = (link: string) => {
    let url

    try {
        url = new URL(link)
    } catch {
        return ''
    }

    if (url.hostname && url.pathname != '/') return `${url.hostname}${url.pathname}`
    else if (url.hostname) return url.hostname
    else return link
}
