import * as cheerio from 'cheerio'

export const importCleaner = (html: string) => {
    if (!html) return html

    const $ = cheerio.load(
        html
            .replace(/“/g, '"')
            .replace(/”/g, '"')
            .replace(/’/g, "'")
            .replace(/<div[^>]*>/g, '')
            .replace(/<\/div>/g, '')
            .replace('&nbsp;', ' ')
    )

    return $.html('p, blockquote, ul, ol, li').replace(/<p><\/p>/g, '')
}
