'use client'

import Link from 'next/link'
import { ArrowRight, Clock3, FolderOpen, Pin, Search, Sparkles } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { Pagination } from '@/components/Pagination'
import type { HomeProps } from '@/components/HomeClient'

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatShortDate(ts: number) {
  const date = new Date(ts * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

function getTopicCopy(label: string) {
  const lower = label.toLowerCase()

  if (lower.includes('ai')) {
    return '围绕工作流、知识整理与真实任务执行的实验。'
  }
  if (lower.includes('产品') || lower.includes('创业')) {
    return '更关心想法如何被验证，而不是只停留在概念层。'
  }
  if (lower.includes('技术') || lower.includes('工程')) {
    return '关注复杂系统、长期维护和真正可复用的结构。'
  }
  if (lower.includes('写作') || lower.includes('内容')) {
    return '把零散输入重新编排成可阅读、可传播、可复盘的表达。'
  }

  return '作为持续追踪的主题，它会在文章、实验和项目里反复出现。'
}

export function HomeVariantD({
  initialTheme,
  posts,
  categories,
  navLinks,
  currentPage,
  totalPages,
  categorySlugMap,
}: HomeProps) {
  const featuredPost = posts[0] ?? null
  const leadPosts = posts.slice(1, 3)
  const timelinePosts = posts.slice(0, 5)
  const categoryCards = categories.slice(0, 3)
  const pinnedCount = posts.filter((post) => post.is_pinned === 1).length
  const latestPost = posts[0]
  const heroCategories = categories.slice(0, 4)

  return (
    <div className="theme-home-lucaslab min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader
        initialTheme={initialTheme}
        navLinks={navLinks}
        categories={categories}
      />

      <main className="lucaslab-home-shell flex-1 mx-auto w-full max-w-[1360px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <section className="grid gap-10 border-b border-[var(--editor-line)] pb-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--editor-muted)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--editor-accent)] shadow-[0_0_18px_rgba(94,109,83,0.3)]" />
              <span>Personal Lab</span>
              <span className="text-[var(--stone-gray)]">Build · Validate · Record</span>
            </div>

            <div className="space-y-5">
              <h1
                className="max-w-4xl text-[clamp(3rem,8vw,6.4rem)] font-black leading-[0.94] tracking-[-0.05em] text-[var(--editor-ink)]"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
              >
                构建、验证、记录
                <br />
                有价值的想法。
              </h1>
              <div className="h-1.5 w-40 skew-x-[-16deg] rounded-full bg-[linear-gradient(90deg,var(--editor-accent),var(--editor-highlight))]" />
              <div className="max-w-2xl space-y-4 text-[15px] leading-8 text-[var(--editor-muted)] sm:text-[17px]">
                <p>
                  这里不是单纯的文章列表，更像一张持续展开的工作台：技术、产品、AI
                  实验和个人判断会被放在同一处，慢慢长出结构。
                </p>
                <p>
                  我希望它保留构建中的痕迹，也保留写作里的温度。一个主题先被看见，再被拆解，最后变成真正能使用的系统或内容。
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredPost && (
                <Link
                  href={`/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--editor-accent)] bg-[var(--editor-accent)] px-5 py-3 text-sm font-medium text-[var(--editor-accent-ink)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  查看头条
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--editor-line)] bg-[var(--paper-soft)] px-5 py-3 text-sm font-medium text-[var(--editor-ink)] transition-colors duration-200 hover:bg-[var(--paper-strong)]"
              >
                搜索主题
                <Search className="h-4 w-4" />
              </Link>
            </div>

            {heroCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-[var(--editor-muted)]">
                <span className="text-[var(--stone-gray)]">持续关注</span>
                {heroCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="rounded-md border border-[var(--editor-line)] bg-[var(--paper-soft)] px-3 py-1.5 transition-colors duration-200 hover:bg-[var(--paper-strong)] hover:text-[var(--editor-ink)]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative min-h-[560px] lg:min-h-[620px]">
            <div className="absolute left-5 top-10 hidden h-[390px] w-[290px] rotate-[-6deg] border border-[var(--editor-line)] bg-[var(--paper-strong)] shadow-[0_24px_48px_rgba(71,58,39,0.08)] lg:block" />
            <div className="absolute left-10 top-6 hidden h-[390px] w-[290px] rotate-[5deg] border border-[var(--editor-line)] bg-[var(--paper)] shadow-[0_24px_48px_rgba(71,58,39,0.08)] lg:block" />

            <div className="relative z-10 overflow-hidden rounded-[18px] border border-[var(--editor-line)] bg-[var(--paper)] p-6 shadow-[0_30px_60px_rgba(71,58,39,0.12)]">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(88,71,43,0.08) 0.45px, transparent 0.45px), radial-gradient(rgba(88,71,43,0.05) 0.35px, transparent 0.35px)',
                  backgroundPosition: '0 0, 8px 8px',
                  backgroundSize: '14px 14px, 18px 18px',
                }}
              />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--editor-line)] pb-4">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--stone-gray)]">
                      Current Focus
                    </p>
                    <h2
                      className="text-xl font-bold text-[var(--editor-ink)]"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      Lucas Lab
                    </h2>
                  </div>
                  <div className="rounded-full border border-[var(--editor-line)] bg-[var(--paper-strong)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--editor-muted)]">
                    Worktable
                  </div>
                </div>

                {featuredPost ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 rounded-[16px] border border-[var(--editor-line)] bg-[rgba(255,255,255,0.58)] p-4">
                      <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="overflow-hidden rounded-[10px] border border-[var(--editor-line)] bg-[linear-gradient(135deg,var(--editor-soft),var(--paper-strong))] p-3">
                          <div className="grid h-full gap-2 rounded-[8px] border border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.72)] p-3">
                            <div className="h-2 rounded-full bg-[rgba(94,109,83,0.14)]" />
                            <div className="h-2 w-4/5 rounded-full bg-[rgba(94,109,83,0.14)]" />
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div className="h-10 rounded-md bg-[rgba(94,109,83,0.1)]" />
                              <div className="h-10 rounded-md bg-[rgba(94,109,83,0.08)]" />
                              <div className="h-10 rounded-md bg-[rgba(94,109,83,0.1)]" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Featured Note</span>
                          </div>
                          <Link href={`/${featuredPost.slug}`} className="block">
                            <h3
                              className="text-lg font-bold leading-7 text-[var(--editor-ink)] transition-colors duration-200 hover:text-[var(--editor-accent)]"
                              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                            >
                              {featuredPost.title}
                            </h3>
                          </Link>
                          {featuredPost.description && (
                            <p className="text-sm leading-7 text-[var(--editor-muted)]">
                              {featuredPost.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--stone-gray)]">
                            <span>{formatDate(featuredPost.published_at)}</span>
                            {featuredPost.category && (
                              <>
                                <span>·</span>
                                {categorySlugMap[featuredPost.category] ? (
                                  <Link
                                    href={`/category/${categorySlugMap[featuredPost.category]}`}
                                    className="text-[var(--editor-accent)]"
                                  >
                                    {featuredPost.category}
                                  </Link>
                                ) : (
                                  <span className="text-[var(--editor-accent)]">{featuredPost.category}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {leadPosts.length > 0 && (
                      <div className="grid gap-3">
                        {leadPosts.map((post) => (
                          <Link
                            key={post.slug}
                            href={`/${post.slug}`}
                            className="group flex items-start justify-between gap-3 rounded-[14px] border border-[var(--editor-line)] bg-[rgba(255,255,255,0.52)] px-4 py-3 transition-colors duration-200 hover:bg-[var(--paper-strong)]"
                          >
                            <div className="space-y-1">
                              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                                {formatShortDate(post.published_at)}
                              </div>
                              <div
                                className="text-sm font-semibold leading-6 text-[var(--editor-ink)] transition-colors duration-200 group-hover:text-[var(--editor-accent)]"
                                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                              >
                                {post.title}
                              </div>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--editor-muted)] transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[14px] border border-[var(--editor-line)] bg-[rgba(255,255,255,0.52)] p-5 text-sm leading-7 text-[var(--editor-muted)]">
                    还没有文章，但主题已经准备好了。接下来这里会逐步长出文章、实验记录和长期项目。
                  </div>
                )}

                <div className="grid gap-3 border-t border-[var(--editor-line)] pt-5 text-sm text-[var(--editor-muted)] sm:grid-cols-3">
                  <div className="rounded-[14px] border border-[var(--editor-line)] bg-[rgba(255,255,255,0.52)] p-4">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>Categories</span>
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-[var(--editor-ink)]">{categories.length}</div>
                    <p className="mt-1 text-xs leading-6">主题不是按平台堆积，而是按长期关注的问题展开。</p>
                  </div>
                  <div className="rounded-[14px] border border-[var(--editor-line)] bg-[rgba(255,255,255,0.52)] p-4">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                      <Pin className="h-3.5 w-3.5" />
                      <span>Pinned</span>
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-[var(--editor-ink)]">{pinnedCount}</div>
                    <p className="mt-1 text-xs leading-6">被反复引用、持续回看的内容会自然浮到前面。</p>
                  </div>
                  <div className="rounded-[14px] border border-[var(--editor-line)] bg-[rgba(255,255,255,0.52)] p-4">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>Latest</span>
                    </div>
                    <div className="mt-2 text-base font-semibold text-[var(--editor-ink)]">
                      {latestPost ? formatShortDate(latestPost.published_at) : '--.--'}
                    </div>
                    <p className="mt-1 text-xs leading-6">每次更新都像往纸上补一层新的判断与证据。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-12 border-b border-[var(--editor-line)] py-16 lg:grid-cols-[minmax(0,1.45fr)_380px]">
          <div className="space-y-8">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--editor-line)] pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--stone-gray)]">Selected Articles</p>
                <h2
                  className="mt-2 text-3xl font-bold text-[var(--editor-ink)]"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  最近写下来的重点
                </h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--editor-muted)]">
                {posts.length} entries
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-[18px] border border-[var(--editor-line)] bg-[var(--paper)] p-8 text-sm leading-7 text-[var(--editor-muted)]">
                这里会展示文章卡片、摘要和分类信息。等第一批内容写进来，它会更像一张正在被反复使用的研究台面。
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {posts.slice(0, 4).map((post, index) => (
                  <article
                    key={post.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[var(--editor-line)] bg-[var(--paper)] shadow-[0_18px_40px_rgba(71,58,39,0.06)] transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div className="border-b border-[var(--editor-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,241,233,0.88))] px-5 py-4">
                      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                        <span>No.{String(index + 1).padStart(2, '0')}</span>
                        <span>{formatShortDate(post.published_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col px-5 py-5">
                      {post.category && (
                        <div className="mb-3">
                          {categorySlugMap[post.category] ? (
                            <Link
                              href={`/category/${categorySlugMap[post.category]}`}
                              className="inline-flex rounded-full border border-[var(--editor-line)] bg-[var(--paper-soft)] px-3 py-1 text-[12px] text-[var(--editor-accent)]"
                            >
                              {post.category}
                            </Link>
                          ) : (
                            <span className="inline-flex rounded-full border border-[var(--editor-line)] bg-[var(--paper-soft)] px-3 py-1 text-[12px] text-[var(--editor-accent)]">
                              {post.category}
                            </span>
                          )}
                        </div>
                      )}
                      <Link href={`/${post.slug}`} className="block">
                        <h3
                          className="text-xl font-bold leading-8 text-[var(--editor-ink)] transition-colors duration-200 group-hover:text-[var(--editor-accent)]"
                          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                        >
                          {post.title}
                        </h3>
                      </Link>
                      {post.description && (
                        <p className="mt-3 flex-1 text-sm leading-7 text-[var(--editor-muted)]">
                          {post.description}
                        </p>
                      )}
                      <div className="mt-5 flex items-center justify-between gap-4 text-[12px] text-[var(--stone-gray)]">
                        <span>{formatDate(post.published_at)}</span>
                        <span className="inline-flex items-center gap-1 text-[var(--editor-ink)]">
                          阅读
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-[18px] border border-[var(--editor-line)] bg-[var(--paper)] p-6 shadow-[0_18px_40px_rgba(71,58,39,0.06)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--editor-line)] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--stone-gray)]">Topic Radar</p>
                  <h3
                    className="mt-2 text-2xl font-bold text-[var(--editor-ink)]"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    长期主题
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {(categoryCards.length > 0 ? categoryCards : categories.slice(0, 3)).map((category, index) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="group block rounded-[14px] border border-[var(--editor-line)] bg-[var(--paper-soft)] px-4 py-4 transition-colors duration-200 hover:bg-[var(--paper-strong)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                          Track {index + 1}
                        </div>
                        <div
                          className="mt-1 text-lg font-semibold text-[var(--editor-ink)] transition-colors duration-200 group-hover:text-[var(--editor-accent)]"
                          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                        >
                          {category.name}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-[var(--editor-muted)]">
                          {getTopicCopy(category.name)}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--editor-muted)] transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}

                {categoryCards.length === 0 && (
                  <div className="rounded-[14px] border border-[var(--editor-line)] bg-[var(--paper-soft)] px-4 py-4 text-sm leading-7 text-[var(--editor-muted)]">
                    主题雷达会根据分类逐步充实。你也可以先在后台建立自己的长期议题框架。
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[18px] border border-[var(--editor-line)] bg-[var(--paper)] p-6 shadow-[0_18px_40px_rgba(71,58,39,0.06)]">
              <div className="flex items-baseline justify-between gap-4 border-b border-[var(--editor-line)] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--stone-gray)]">Recent Trace</p>
                  <h3
                    className="mt-2 text-2xl font-bold text-[var(--editor-ink)]"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    最近更新
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {timelinePosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    className="group grid grid-cols-[56px_minmax(0,1fr)] gap-4"
                  >
                    <div className="pt-1 text-right text-[11px] uppercase tracking-[0.18em] text-[var(--stone-gray)]">
                      {formatShortDate(post.published_at)}
                    </div>
                    <div className="relative border-l border-[var(--editor-line)] pl-5">
                      <span className="absolute left-[-5px] top-2 h-2.5 w-2.5 rounded-full bg-[var(--editor-accent)]" />
                      <div
                        className="text-base font-semibold leading-7 text-[var(--editor-ink)] transition-colors duration-200 group-hover:text-[var(--editor-accent)]"
                        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                      >
                        {post.title}
                      </div>
                      <p className="mt-1 text-sm leading-7 text-[var(--editor-muted)]">
                        {post.description || '从一个问题继续展开，给站点留下新的上下文。'}
                      </p>
                      {index < timelinePosts.length - 1 && <div className="pt-5" />}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="py-10">
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
