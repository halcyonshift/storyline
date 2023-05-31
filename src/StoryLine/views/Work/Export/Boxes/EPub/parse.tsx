import { ExportDataType } from '@sl/forms/Work/Export/types'
import * as cheerio from 'cheerio'

const parse = (html: string, settings: ExportDataType) => {
    const $ = cheerio.load(html)

    $('a').each((_, element) => {
        element.attribs = {}
        $(element).replaceWith($(element).text())
    })

    $('blockquote').each((_, element) => {
        element.attribs = {}
        $(element).replaceWith(`<p>${$(element).text()}</p>`)
    })

    $('body *').each((_, element) => {
        element.attribs = {}
    })

    if (settings) $('p').attr('style', 'text-indent:1.3em')

    return $.html()
}

export default parse
