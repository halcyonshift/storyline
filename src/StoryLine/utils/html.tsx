import Typography from '@mui/material/Typography'
import { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser'
import { spacing } from '@sl/theme/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getExportHTMLParseOptions = (settings: any): HTMLReactParserOptions => ({
    replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'p') {
            return (
                <p
                    style={{
                        marginTop: spacing[settings.paragraphSpacing] || 'auto',
                        marginBottom: spacing[settings.paragraphSpacing] || 'auto',
                        textIndent: settings.indentParagraph ? '38px' : ''
                    }}>
                    {domToReact(domNode.children, getExportHTMLParseOptions(settings))}
                </p>
            )
        }

        if (domNode instanceof Element && domNode.attribs && domNode.name === 'a') {
            return <span>{domToReact(domNode.children, getExportHTMLParseOptions(settings))}</span>
        }
    }
})

export const docxExtractExcerptsOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'p') {
            return <p>{domToReact(domNode.children, docxExtractExcerptsOptions)}</p>
        }

        if (domNode instanceof Element && domNode.attribs && domNode.name === 'a') {
            return <span>{domToReact(domNode.children, docxExtractExcerptsOptions)}</span>
        }
    }
}

export const htmlExtractExcerptsOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element) {
            if (domNode.name !== 'blockquote') return <></>
            return <Typography variant='body2'>{domToReact(domNode.children)}</Typography>
        }
    }
}

export const htmlParseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        /*
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'p') {
            return (
                <Typography variant='body1'>
                    {domToReact(domNode.children, htmlParseOptions)}
                </Typography>
            )
        }
        */
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'a') {
            return <span>{domToReact(domNode.children, htmlParseOptions)}</span>
        }
    }
}
