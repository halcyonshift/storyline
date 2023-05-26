import Typography from '@mui/material/Typography'
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser'
import * as cheerio from 'cheerio'

// strip all html and convert to text

export const htmlToText = (html: string) => {
    const $ = cheerio.load(`<div>${html.replace(/<\/p>/g, ' ')}</div>`)
    return $('div').text()
}

// clean html to allow only given elements on import

export const importCleaner = (
    html: string,
    allowedTags = ['p', 'ol', 'ul', 'em', 'li', 'strong', 'u', 's']
) => {
    const $ = cheerio.load(
        html
            .replace(/“/g, '"')
            .replace(/”/g, '"')
            .replace(/’/g, "'")
            .replace(/<div[^>]*>/g, '')
            .replace(/<\/div>/g, '')
            .replace('&nbsp;', ' ')
    )

    $('body *').each((_, element) => {
        const tagName = element.tagName.toLowerCase()
        element.attribs = {}

        if (!allowedTags.includes(tagName)) {
            if (['a'].includes(tagName)) {
                $(element).replaceWith($(element).text())
            } else if (
                [
                    'img',
                    'video',
                    'object',
                    'embed',
                    'script',
                    'link',
                    'html',
                    'head',
                    'title',
                    'meta'
                ].includes(tagName)
            ) {
                $(element).remove()
            } else {
                $(element).replaceWith('<p>' + $(element).text() + '</p>')
            }
        }
    })

    return $.html('body *')
}

// display html on a view

const htmlParseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'p') {
            return (
                <Typography variant='body1'>
                    {domToReact(domNode.children, htmlParseOptions)}
                </Typography>
            )
        }

        if (domNode instanceof Element && domNode.attribs && domNode.name === 'a') {
            return <>{domToReact(domNode.children, htmlParseOptions)}</>
        }
    }
}

export const htmlParse = (s: string) => parse(s, htmlParseOptions)

// get blockquote text to display as excerpt

export const htmlExtractExcerpts = (s: string) =>
    parse(s, {
        replace: (domNode) => {
            if (domNode instanceof Element) {
                if (domNode.name !== 'blockquote') return <></>
                return <Typography variant='body2'>{domToReact(domNode.children)}</Typography>
            }
        }
    })
