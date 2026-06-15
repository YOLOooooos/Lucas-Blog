import CodeBlock from '@tiptap/extension-code-block'

export function createEditorCodeBlockParseRules() {
  return [
    {
      tag: 'pre',
      contentElement: 'code',
      preserveWhitespace: 'full' as const,
    },
    {
      tag: 'pre',
      preserveWhitespace: 'full' as const,
    },
  ]
}

export const EditorCodeBlock = CodeBlock.extend({
  parseHTML() {
    return createEditorCodeBlockParseRules()
  },
})
