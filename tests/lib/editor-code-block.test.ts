import { describe, expect, it } from 'vitest'
import { createEditorCodeBlockParseRules } from '@/lib/editor-code-block'

describe('editor code block parsing', () => {
  it('reads published <pre><code> blocks from the code child as one preserved text block', () => {
    const rules = createEditorCodeBlockParseRules()

    expect(rules[0]).toMatchObject({
      tag: 'pre',
      contentElement: 'code',
      preserveWhitespace: 'full',
    })
    expect(rules[1]).toMatchObject({
      tag: 'pre',
      preserveWhitespace: 'full',
    })
    expect(rules[1]).not.toHaveProperty('contentElement')
  })
})
