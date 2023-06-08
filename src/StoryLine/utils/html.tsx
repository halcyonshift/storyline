import Typography from '@mui/material/Typography'
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser'
import * as cheerio from 'cheerio'

// strip all html and convert to text

export const htmlToText = (html: string) => {
    if (!html) return ''
    const $ = cheerio.load(`<div>${html.replace(/<\/p>/g, ' ')}</div>`)
    return $('div').text()
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
