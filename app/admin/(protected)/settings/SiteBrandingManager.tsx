'use client'

import { useState } from 'react'

interface Props {
  initialSiteTitle: string
  initialSiteOwnerName: string
  onSave: (values: { siteTitle: string; siteOwnerName: string }) => void | Promise<void>
  saving: boolean
}

const inputCls =
  'h-10 rounded-lg border border-[var(--editor-line)] bg-[var(--background)] px-3 text-sm text-[var(--editor-ink)] placeholder:text-[var(--editor-muted)] outline-none focus:border-[var(--editor-accent)] transition-colors'

export function SiteBrandingManager({
  initialSiteTitle,
  initialSiteOwnerName,
  onSave,
  saving,
}: Props) {
  const [siteTitle, setSiteTitle] = useState(initialSiteTitle)
  const [siteOwnerName, setSiteOwnerName] = useState(initialSiteOwnerName)

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--editor-muted)]">
        这里控制站点最核心的品牌文案。后台头部、后台页脚，以及前台主要标题和署名会优先读取这里。
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm font-medium text-[var(--editor-ink)]">站点名称</span>
          <input
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="例如：乔木博客"
            className={inputCls}
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-[var(--editor-ink)]">署名 / 版权名称</span>
          <input
            value={siteOwnerName}
            onChange={(e) => setSiteOwnerName(e.target.value)}
            placeholder="例如：向阳乔木"
            className={inputCls}
          />
        </label>
      </div>

      <button
        onClick={() =>
          void onSave({
            siteTitle: siteTitle.trim(),
            siteOwnerName: siteOwnerName.trim(),
          })
        }
        disabled={saving}
        className="rounded-lg bg-[var(--editor-accent)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50"
      >
        {saving ? '保存中…' : '保存基础信息'}
      </button>
    </div>
  )
}
