import { default as _parse, domToReact, HTMLReactParserOptions, Element } from 'html-react-parser'
import { camelCase } from 'lodash'
import { ExportDataType } from '@sl/forms/Work/Export/types'

const DEFAULT_SIZE = '12px'

const styleObject = (style: string, settings: ExportDataType) => ({
    ...Object.assign(
        {},
        ...style.split(';').map((rule) => {
            const [property, value] = rule.split(':')
            return property && value ? { [camelCase(property.trim())]: value.trim() } : {}
        })
    ),
    ...{
        fontFamily: settings?.font || 'arial',
        fontSize: settings?.fontSize ? `${settings?.fontSize}px` : DEFAULT_SIZE,
        lineHeight: { normal: 1.2, relaxed: 1.6, loose: 1.8 }[settings?.lineHeight || 'normal'],
        letterSpacing: '0.01px',
        textIndent: settings?.indentParagraph ? '1.3em' : '',
        marginTop: settings?.fontSize ? `${settings?.fontSize}px` : DEFAULT_SIZE,
        marginBottom: settings?.fontSize ? `${settings?.fontSize}px` : DEFAULT_SIZE
    }
})

export const parserOptions = (settings: ExportDataType): HTMLReactParserOptions => ({
    replace: (domNode: Element) => {
        if (domNode?.attribs?.className) {
            if (domNode.attribs.className.includes('line-through'))
                return <s>{domToReact(domNode.children, parserOptions(settings))}</s>
            else if (domNode.attribs.className.includes('underline'))
                return <u>{domToReact(domNode.children, parserOptions(settings))}</u>
        }

        const attribs = {
            style: domNode?.attribs?.style,
            dir: domNode?.attribs?.dir || 'ltr'
        }

        domNode.attribs = {}

        // ToDo - em is repeating needs fix

        if (['p', 'blockquote'].includes(domNode.name)) {
            return (
                <p style={styleObject(attribs.style || '', settings)} dir={attribs.dir}>
                    {domToReact(domNode.children, parserOptions(settings))}
                </p>
            )
        }

        if (['a', 'i', 'b'].includes(domNode.name)) {
            return <>{domToReact(domNode.children, parserOptions(settings))}</>
        }
    }
})

export const parse = (html: string, settings: ExportDataType) => {
    return _parse(html, parserOptions(settings))
}
