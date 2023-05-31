import { DateTime } from 'luxon'
import { htmlToText } from './html'

export const autoCompleteOptions = (data: { id: string; displayName: string }[]) => {
    return data.map((item) => ({ id: item.id, label: item.displayName }))
}

export const dateFormat = (jsDate: Date) => {
    return DateTime.fromJSDate(jsDate).toLocaleString(DateTime.DATETIME_SHORT)
}

export const wordCount = (s: string, lang = 'en') => {
    s = htmlToText(s).trim()
    const segmenter = new Intl.Segmenter(lang, {
        granularity: 'word'
    })
    const segments = segmenter.segment(s)
    return [...segments].filter((s) => s.isWordLike).length
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

export const displayDate = (value: string | null): string => {
    const date = DateTime.fromSQL(value || '')
    return date.isValid ? date.toFormat('EEEE dd LLL yyyy') : value || ''
}

export const displayTime = (value: string | null): string => {
    const date = DateTime.fromSQL(value || '')
    return date.isValid ? date.toFormat('H:mm') : value || ''
}

export const displayDateTime = (value: Date | string | null): string => {
    if (value instanceof Date) {
        const date = DateTime.fromJSDate(value)
        return date.toFormat('EEEE dd LLL yyyy H:mm')
    }

    const date = DateTime.fromSQL(value || '')
    return date.isValid ? date.toFormat('EEEE dd LLL yyyy H:mm') : value || ''
}

export const sortDate = (value: string | null): number => {
    const date = DateTime.fromSQL(value || '')
    return date.isValid ? date.toSeconds() : 0
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
