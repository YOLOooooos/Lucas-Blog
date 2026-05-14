interface TextAiPromptCopyInput {
  actionLabel?: string
  actionDescription?: string
  customInstruction?: string
  contextLabel: string
  inputText: string
}

interface ImageAiPromptCopyInput {
  userPrompt?: string
  actionLabel?: string
  actionDescription?: string
  contextText?: string
  aspectRatioLabel?: string
  resolutionLabel?: string
  hasReferenceImage?: boolean
}

function joinLabelAndDescription(label?: string, description?: string) {
  const normalizedLabel = label?.trim()
  const normalizedDescription = description?.trim()

  if (normalizedLabel && normalizedDescription) {
    return `${normalizedLabel}：${normalizedDescription}`
  }

  return normalizedLabel || normalizedDescription || ''
}

export function buildTextAiPromptCopyText({
  actionLabel,
  actionDescription,
  customInstruction,
  contextLabel,
  inputText,
}: TextAiPromptCopyInput) {
  const instruction = customInstruction?.trim()
    || joinLabelAndDescription(actionLabel, actionDescription)
    || '请基于下面内容进行处理'
  const normalizedText = inputText.trim()

  if (!normalizedText) return ''

  return [
    '请作为专业写作助手，根据以下指令处理内容。',
    '',
    `【处理指令】\n${instruction}`,
    '',
    `【内容范围】\n${contextLabel.trim() || '当前内容'}`,
    '',
    `【待处理内容】\n${normalizedText}`,
    '',
    '请直接输出结果，不要添加解释或无关说明。',
  ].join('\n')
}

export function buildImageAiPromptCopyText({
  userPrompt,
  actionLabel,
  actionDescription,
  contextText,
  aspectRatioLabel,
  resolutionLabel,
  hasReferenceImage = false,
}: ImageAiPromptCopyInput) {
  const sections = [
    '请作为图像生成模型，根据以下信息生成图片。',
  ]
  const actionText = joinLabelAndDescription(actionLabel, actionDescription)
  const normalizedPrompt = userPrompt?.trim()
  const normalizedContext = contextText?.trim()
  const normalizedAspectRatio = aspectRatioLabel?.trim()
  const normalizedResolution = resolutionLabel?.trim()

  if (actionText) {
    sections.push(`【生成目标】\n${actionText}`)
  }

  if (normalizedPrompt) {
    sections.push(`【画面描述】\n${normalizedPrompt}`)
  }

  if (normalizedContext) {
    sections.push(`【补充上下文】\n${normalizedContext}`)
  }

  if (normalizedAspectRatio) {
    sections.push(`【构图比例】\n${normalizedAspectRatio}`)
  }

  if (normalizedResolution) {
    sections.push(`【输出精度】\n${normalizedResolution}`)
  }

  if (hasReferenceImage) {
    sections.push('【参考图片】\n请参考随提示词一起提供的图片，保持主体关系和重要视觉特征。')
  }

  sections.push('请直接生成图片，不要在图片中加入水印、说明文字或无关文字，除非画面描述明确要求。')

  return sections.join('\n\n')
}
