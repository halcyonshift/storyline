import { $generateHtmlFromNodes } from '@lexical/html'
import { ListItemNode, ListNode } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import InitialValuePlugin from './plugins/InitialValue'
import ToolbarPlugin from './plugins/Toolbar'
import theme from './theme'
import { TextareaFieldProps } from './types'

const TextareaField = ({ form, label, fieldName }: TextareaFieldProps) => {
    const { t } = useTranslation()

    return (
        <Box>
            <InputLabel>{label}</InputLabel>
            <Box className='border border-t-0 mt-1'>
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
                    <Box className='rte-container relative min-h-[100px]'>
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable className='resize-none outline-none p-3' />
                            }
                            placeholder={
                                <Typography
                                    variant='body1'
                                    className='text-slate-500 overflow-hidden absolute
                            top-[15px] left-[10px] inline-block pointer-events-none'>
                                    {t('component.textareaField.placeholder')}
                                </Typography>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <InitialValuePlugin text={form.initialValues[fieldName]} />
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
