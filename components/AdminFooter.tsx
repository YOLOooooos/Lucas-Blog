import { DEFAULT_SITE_OWNER_NAME } from '@/lib/site-branding'

interface AdminFooterProps {
  siteOwnerName?: string
}

export function AdminFooter({ siteOwnerName = DEFAULT_SITE_OWNER_NAME }: AdminFooterProps) {
  return (
    <footer className="mt-auto border-t border-[var(--editor-line)] bg-[var(--editor-panel)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-center text-xs text-[var(--stone-gray)]">
          <span>© 2026</span>
          <span className="mx-2">·</span>
          <span>{siteOwnerName}</span>
        </div>
      </div>
    </footer>
  )
}
