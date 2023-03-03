import Typography from '@mui/material/Typography'
import { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser'

export const htmlExtractExcerptsOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element) {
            if (domNode.name !== 'blockquote') return <></>
            return <Typography variant='body1'>{domToReact(domNode.children)}</Typography>
        }
    }
}

export const htmlParseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'p') {
            return (
                <Typography variant='body1'>
                    {domToReact(domNode.children, htmlParseOptions)}
                </Typography>
            )
        }
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'a') {
            return <span>{domToReact(domNode.children, htmlParseOptions)}</span>
        }
    }
}
