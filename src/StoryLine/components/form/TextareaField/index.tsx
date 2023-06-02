import { useEffect, useState } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ListItemNode, ListNode } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Box, Typography } from '@mui/material'
import InitialValuePlugin from '@sl/components/RichtextEditor/plugins/InitialValue'
import ToolbarPlugin from './plugins/Toolbar'
import theme from './theme'
import { TextareaFieldProps } from './types'

const TextareaField = ({ form, label, fieldName }: TextareaFieldProps) => {
    const [initialValue, setInitialValue] = useState<string>()

    useEffect(() => {
        setInitialValue(form.values[fieldName] || form.initialValues[fieldName])
    }, [])

    return (
        <Box>
            <Box className='border rounded-md'>
                <LexicalComposer
                    initialConfig={{
                        namespace: 'rte',
                        theme: theme,
                        nodes: [ListItemNode, ListNode],
                        onError(error: Error) {
                            throw error
                        }
                    }}>
                    <ToolbarPlugin />
                    <Box className='rte-container relative min-h-[100px]' id={fieldName}>
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className='resize-none outline-none p-3'
                                    ariaLabel='text editor'
                                />
                            }
                            placeholder={
                                <Typography
                                    variant='body1'
                                    className='text-slate-500 overflow-hidden absolute
                            top-[15px] left-[10px] inline-block pointer-events-none'>
                                    {label}
                                </Typography>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <InitialValuePlugin value={initialValue} />
                        <ListPlugin />
                        <OnChangePlugin
                            onChange={(_, editor) => {
                                editor.update(() => {
                                    form.setFieldValue(
                                        fieldName,
                                        $generateHtmlFromNodes(editor, null)
                                    )
                                })
                            }}
                        />
                    </Box>
                </LexicalComposer>
            </Box>
        </Box>
    )
}

export default TextareaField
