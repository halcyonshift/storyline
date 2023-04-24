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

// https://stackoverflow.com/a/49938542/12139765
export const toWords = (number: number) => {
    const first = [
        '',
        'one ',
        'two ',
        'three ',
        'four ',
        'five ',
        'six ',
        'seven ',
        'eight ',
        'nine ',
        'ten ',
        'eleven ',
        'twelve ',
        'thirteen ',
        'fourteen ',
        'fifteen ',
        'sixteen ',
        'seventeen ',
        'eighteen ',
        'nineteen '
    ]
    const tens = [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety'
    ]
    const mad = ['', 'thousand', 'million', 'billion', 'trillion']
    let word = ''

    for (let i = 0; i < mad.length; i++) {
        let tempNumber = number % (100 * Math.pow(1000, i))
        if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
            if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word
            } else {
                word =
                    tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
                    '-' +
                    first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
                    mad[i] +
                    ' ' +
                    word
            }
        }

        tempNumber = number % Math.pow(1000, i + 1)
        if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
            word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hundred ' + word
    }
    return word
}
