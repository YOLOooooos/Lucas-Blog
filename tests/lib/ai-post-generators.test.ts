import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createCompletion: vi.fn(),
  workersRun: vi.fn(),
  getAiPostGeneratorByTarget: vi.fn(),
  ensureAiPostGeneratorInfrastructure: vi.fn(),
  listAiPostGenerators: vi.fn(),
  resolveAiProfileConfig: vi.fn(),
  resolveAiImageProfileConfig: vi.fn(),
  generateEditorImage: vi.fn(),
}))

vi.mock('openai', () => ({
  default: function OpenAI() {
    return {
      chat: {
        completions: {
          create: mocks.createCompletion,
        },
      },
    }
  },
}))

vi.mock('@/lib/ai-post-generator/storage', () => ({
  ensureAiPostGeneratorInfrastructure: mocks.ensureAiPostGeneratorInfrastructure,
  getAiPostGeneratorByTarget: mocks.getAiPostGeneratorByTarget,
  listAiPostGenerators: mocks.listAiPostGenerators,
}))

vi.mock('@/lib/ai-provider-profiles', async () => {
  const actual = await vi.importActual<typeof import('@/lib/ai-provider-profiles')>('@/lib/ai-provider-profiles')
  return {
    ...actual,
    resolveAiProfileConfig: mocks.resolveAiProfileConfig,
  }
})

vi.mock('@/lib/ai-image-config', async () => {
  const actual = await vi.importActual<typeof import('@/lib/ai-image-config')>('@/lib/ai-image-config')
  return {
    ...actual,
    resolveAiImageProfileConfig: mocks.resolveAiImageProfileConfig,
  }
})

vi.mock('@/lib/ai-image', async () => {
  const actual = await vi.importActual<typeof import('@/lib/ai-image')>('@/lib/ai-image')
  return {
    ...actual,
    generateEditorImage: mocks.generateEditorImage,
  }
})

import { generatePostCover, generatePostMetadata } from '@/lib/ai-post-generators'

describe('ai-post-generators', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('retries external-provider tag generation when the first response contains reasoning only', async () => {
    mocks.getAiPostGeneratorByTarget.mockResolvedValue({
      id: 2,
      target_key: 'tags',
      label: '标签生成',
      description: '生成标签',
      prompt: '提取标签',
      provider_mode: 'profile',
      text_profile_id: 2,
      image_profile_id: null,
      workers_model: '',
      temperature: 0.3,
      max_tokens: 180,
      aspect_ratio: '16:9',
      resolution: '2k',
      is_enabled: 1,
      is_builtin: 1,
      created_at: 0,
      updated_at: 0,
    })
    mocks.resolveAiProfileConfig.mockResolvedValue({
      id: 2,
      name: '文本模型',
      provider: 'custom',
      provider_name: 'Custom',
      provider_type: 'openai_compatible',
      provider_category: '',
      api_key_url: '',
      base_url: 'https://example.com/v1',
      model: 'test-model',
      temperature: 0.7,
      max_tokens: 1200,
      api_key: 'test-key',
      api_key_masked: 'test***',
      is_default: 1,
    })
    mocks.createCompletion
      .mockResolvedValueOnce({
        choices: [
          {
            finish_reason: 'length',
            message: {
              content: '',
              reasoning: '先分析标签候选',
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            finish_reason: 'stop',
            message: {
              content: '{"tags":["AI写作","提示词设计","自动化工作流"]}',
            },
          },
        ],
      })

    const result = await generatePostMetadata({
      target: 'tags',
      title: '测试标题',
      content: '这篇文章讨论 AI 写作编辑器、提示词设计和自动化工作流。',
      category: 'AI',
      description: '',
      tags: [],
      currentSlug: '',
      db: {} as D1Database,
      env: {} as Partial<CloudflareEnv>,
    })

    expect(result.value).toEqual(['AI写作', '提示词设计', '自动化工作流'])
    expect(mocks.createCompletion).toHaveBeenCalledTimes(2)
  })

  it('retries workers-ai slug generation when the first response contains reasoning only', async () => {
    mocks.getAiPostGeneratorByTarget.mockResolvedValue({
      id: 3,
      target_key: 'slug',
      label: 'Slug 生成',
      description: '生成 slug',
      prompt: '生成 slug',
      provider_mode: 'workers_ai',
      text_profile_id: null,
      image_profile_id: null,
      workers_model: '@cf/zai-org/glm-4.7-flash',
      temperature: 0.2,
      max_tokens: 80,
      aspect_ratio: '16:9',
      resolution: '2k',
      is_enabled: 1,
      is_builtin: 1,
      created_at: 0,
      updated_at: 0,
    })
    mocks.workersRun
      .mockResolvedValueOnce({
        choices: [
          {
            finish_reason: 'length',
            message: {
              content: null,
              reasoning: '先分析标题语义',
              reasoning_content: '先分析标题语义',
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            finish_reason: 'stop',
            message: {
              content: '{"slug":"testing-ai-writing-editor"}',
            },
          },
        ],
      })

    const result = await generatePostMetadata({
      target: 'slug',
      title: '测试 AI 写作编辑器',
      content: '这篇文章讨论 AI 写作编辑器、提示词设计和自动化工作流。',
      category: 'AI',
      description: '',
      tags: [],
      currentSlug: '',
      db: {} as D1Database,
      env: {
        WORKERS_AI: {
          run: mocks.workersRun,
        } as unknown as WorkersAIBinding,
        ENABLE_WORKERS_AI: 'true',
      } as Partial<CloudflareEnv>,
    })

    expect(result.value).toBe('testing-ai-writing-editor')
    expect(mocks.workersRun).toHaveBeenCalledTimes(2)
  })

  it('extracts tags from tool call arguments when content is empty', async () => {
    mocks.getAiPostGeneratorByTarget.mockResolvedValue({
      id: 2,
      target_key: 'tags',
      label: '标签生成',
      description: '生成标签',
      prompt: '提取标签',
      provider_mode: 'profile',
      text_profile_id: 2,
      image_profile_id: null,
      workers_model: '',
      temperature: 0.3,
      max_tokens: 180,
      aspect_ratio: '16:9',
      resolution: '2k',
      is_enabled: 1,
      is_builtin: 1,
      created_at: 0,
      updated_at: 0,
    })
    mocks.resolveAiProfileConfig.mockResolvedValue({
      id: 2,
      name: '文本模型',
      provider: 'custom',
      provider_name: 'Custom',
      provider_type: 'openai_compatible',
      provider_category: '',
      api_key_url: '',
      base_url: 'https://example.com/v1',
      model: 'test-model',
      temperature: 0.7,
      max_tokens: 1200,
      api_key: 'test-key',
      api_key_masked: 'test***',
      is_default: 1,
    })
    mocks.createCompletion.mockResolvedValueOnce({
      choices: [
        {
          finish_reason: 'tool_calls',
          message: {
            content: null,
            tool_calls: [
              {
                function: {
                  arguments: '{"tags":["AI写作","提示词设计","自动化工作流"]}',
                },
              },
            ],
          },
        },
      ],
    })

    const result = await generatePostMetadata({
      target: 'tags',
      title: '测试标题',
      content: '这篇文章讨论 AI 写作编辑器、提示词设计和自动化工作流。',
      category: 'AI',
      description: '',
      tags: [],
      currentSlug: '',
      db: {} as D1Database,
      env: {} as Partial<CloudflareEnv>,
    })

    expect(result.value).toEqual(['AI写作', '提示词设计', '自动化工作流'])
    expect(mocks.createCompletion).toHaveBeenCalledTimes(1)
  })

  it('extracts a slug from workers-ai tool call arguments when content is empty', async () => {
    mocks.getAiPostGeneratorByTarget.mockResolvedValue({
      id: 3,
      target_key: 'slug',
      label: 'Slug 生成',
      description: '生成 slug',
      prompt: '生成 slug',
      provider_mode: 'workers_ai',
      text_profile_id: null,
      image_profile_id: null,
      workers_model: '@cf/zai-org/glm-4.7-flash',
      temperature: 0.2,
      max_tokens: 80,
      aspect_ratio: '16:9',
      resolution: '2k',
      is_enabled: 1,
      is_builtin: 1,
      created_at: 0,
      updated_at: 0,
    })
    mocks.workersRun.mockResolvedValueOnce({
      choices: [
        {
          finish_reason: 'tool_calls',
          message: {
            content: null,
            tool_calls: [
              {
                function: {
                  arguments: '{"slug":"testing-ai-writing-editor"}',
                },
              },
            ],
          },
        },
      ],
    })

    const result = await generatePostMetadata({
      target: 'slug',
      title: '测试 AI 写作编辑器',
      content: '这篇文章讨论 AI 写作编辑器、提示词设计和自动化工作流。',
      category: 'AI',
      description: '',
      tags: [],
      currentSlug: '',
      db: {} as D1Database,
      env: {
        WORKERS_AI: {
          run: mocks.workersRun,
        } as unknown as WorkersAIBinding,
        ENABLE_WORKERS_AI: 'true',
      } as Partial<CloudflareEnv>,
    })

    expect(result.value).toBe('testing-ai-writing-editor')
    expect(mocks.workersRun).toHaveBeenCalledTimes(1)
  })

  it('falls back to the default text profile when the saved generator profile has been deleted', async () => {
    mocks.getAiPostGeneratorByTarget.mockResolvedValue({
      id: 1,
      target_key: 'summary',
      label: '摘要生成',
      description: '生成摘要',
      prompt: '生成摘要',
      provider_mode: 'profile',
      text_profile_id: 404,
      image_profile_id: null,
      workers_model: '',
      temperature: 0.3,
      max_tokens: 200,
      aspect_ratio: '16:9',
      resolution: '2k',
      is_enabled: 1,
      is_builtin: 1,
      created_at: 0,
      updated_at: 0,
    })
    mocks.resolveAiProfileConfig.mockImplementation(async (_db, _secret, profileId) => {
      if (profileId === undefined) {
        return {
          id: 2,
          name: '默认文本模型',
          provider: 'custom',
          provider_name: 'Custom',
          provider_type: 'openai_compatible',
          provider_category: '',
          api_key_url: '',
          base_url: 'https://example.com/v1',
          model: 'text-model',
          temperature: 0.7,
          max_tokens: 1200,
          api_key: 'test-key',
          api_key_masked: 'test***',
          is_default: 1,
        }
      }
      return null
    })
    mocks.createCompletion.mockResolvedValueOnce({
      choices: [
        {
          finish_reason: 'stop',
          message: {
            content: '{"summary":"自动修复后的摘要"}',
          },
        },
      ],
    })

    const runCalls: Array<{ sql: string; values: unknown[] }> = []
    const fakeDb = {
      prepare(sql: string) {
        return {
          bind(...values: unknown[]) {
            return {
              first: async () => {
                if (sql.includes('FROM ai_provider_profiles')) return null
                return null
              },
              run: async () => {
                runCalls.push({ sql, values })
                return {}
              },
            }
          },
        }
      },
    } as unknown as D1Database

    const result = await generatePostMetadata({
      target: 'summary',
      title: '测试标题',
      content: '这是一篇用于验证默认文本模型回退的文章。',
      category: 'AI',
      description: '',
      tags: [],
      currentSlug: '',
      db: fakeDb,
      env: {} as Partial<CloudflareEnv>,
    })

    expect(result.value).toBe('自动修复后的摘要')
    expect(mocks.resolveAiProfileConfig).toHaveBeenCalledWith(fakeDb, expect.any(String))
    expect(runCalls).toContainEqual({
      sql: expect.stringContaining('UPDATE ai_post_generators'),
      values: [2, 'summary', 404],
    })
  })

  it('falls back to the default image profile when the saved cover profile has been deleted', async () => {
    mocks.getAiPostGeneratorByTarget.mockResolvedValue({
      id: 4,
      target_key: 'cover',
      label: '封面生成',
      description: '生成封面',
      prompt: '生成封面',
      provider_mode: 'profile',
      text_profile_id: null,
      image_profile_id: 404,
      workers_model: '',
      temperature: 0.3,
      max_tokens: 200,
      aspect_ratio: '16:9',
      resolution: '2k',
      is_enabled: 1,
      is_builtin: 1,
      created_at: 0,
      updated_at: 0,
    })
    mocks.resolveAiImageProfileConfig.mockImplementation(async (_db, _secret, profileId) => {
      if (profileId === undefined) {
        return {
          id: 7,
          name: '默认图片模型',
          provider: 'custom',
          provider_name: 'Custom',
          provider_type: 'openai_images',
          provider_category: '',
          api_key_url: '',
          base_url: 'https://images.example.com/v1',
          model: 'image-model',
          api_key: 'image-key',
          api_key_masked: 'imag***',
          is_default: 1,
        }
      }
      return null
    })
    mocks.generateEditorImage.mockResolvedValue({
      key: 'image/2026/05/test.png',
      url: '/api/images/test',
      variants: { original: '/api/images/test' },
      prompt: '封面提示词',
      revisedPrompt: '封面提示词',
      alt: '测试标题',
      actionLabel: '封面生成',
      aspectRatio: '16:9',
      resolution: '2k',
      size: '1536x1024',
      profileName: '默认图片模型',
      model: 'image-model',
    })

    const runCalls: Array<{ sql: string; values: unknown[] }> = []
    const fakeDb = {
      prepare(sql: string) {
        return {
          bind(...values: unknown[]) {
            return {
              first: async () => {
                if (sql.includes('FROM ai_image_provider_profiles')) return null
                return null
              },
              run: async () => {
                runCalls.push({ sql, values })
                return {}
              },
            }
          },
        }
      },
    } as unknown as D1Database
    const images = {
      put: vi.fn(),
    } as unknown as {
      put: (...args: unknown[]) => Promise<void>
    }

    const result = await generatePostCover({
      title: '测试标题',
      content: '测试正文',
      category: 'AI',
      description: '',
      tags: [],
      db: fakeDb,
      env: {} as Partial<CloudflareEnv>,
      images,
    })

    expect(result.image.profileName).toBe('默认图片模型')
    expect(mocks.resolveAiImageProfileConfig).toHaveBeenCalledWith(fakeDb, expect.any(String))
    expect(mocks.generateEditorImage).toHaveBeenCalledWith(expect.objectContaining({
      profileId: 7,
    }))
    expect(runCalls).toContainEqual({
      sql: expect.stringContaining('UPDATE ai_post_generators'),
      values: [7, 'cover', 404],
    })
  })
})
