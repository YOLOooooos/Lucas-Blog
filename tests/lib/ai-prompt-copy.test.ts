import { describe, expect, it } from 'vitest'
import {
  buildImageAiPromptCopyText,
  buildTextAiPromptCopyText,
} from '@/lib/ai-prompt-copy'

describe('ai-prompt-copy helpers', () => {
  it('builds a portable text prompt from a quick action', () => {
    const prompt = buildTextAiPromptCopyText({
      actionLabel: '润色',
      actionDescription: '让表达更顺更自然',
      contextLabel: '选中文本',
      inputText: '这是一段需要优化的文字。',
    })

    expect(prompt).toContain('专业写作助手')
    expect(prompt).toContain('润色：让表达更顺更自然')
    expect(prompt).toContain('【内容范围】\n选中文本')
    expect(prompt).toContain('这是一段需要优化的文字。')
    expect(prompt).not.toContain('undefined')
  })

  it('prefers the custom instruction when copying a text prompt', () => {
    const prompt = buildTextAiPromptCopyText({
      actionLabel: '自定义提问',
      customInstruction: '改写成更像公众号开头的风格',
      contextLabel: '标题和正文',
      inputText: '标题：测试\n\n正文：内容',
    })

    expect(prompt).toContain('改写成更像公众号开头的风格')
    expect(prompt).not.toContain('自定义提问：')
    expect(prompt).toContain('标题和正文')
  })

  it('builds a portable image prompt with generation settings', () => {
    const prompt = buildImageAiPromptCopyText({
      userPrompt: '赛博朋克风格的雨夜街道',
      actionLabel: '文章封面',
      actionDescription: '生成适合正文的封面图',
      contextText: '文章讨论城市里的孤独感。',
      aspectRatioLabel: '16:9',
      resolutionLabel: '2K',
      hasReferenceImage: true,
    })

    expect(prompt).toContain('图像生成模型')
    expect(prompt).toContain('赛博朋克风格的雨夜街道')
    expect(prompt).toContain('文章封面：生成适合正文的封面图')
    expect(prompt).toContain('文章讨论城市里的孤独感。')
    expect(prompt).toContain('【构图比例】\n16:9')
    expect(prompt).toContain('参考图片')
  })
})
