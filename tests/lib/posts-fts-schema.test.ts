import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const schemaSql = readFileSync(join(repoRoot, 'db', 'schema.sql'), 'utf8')
const repairSqlPath = join(repoRoot, 'db', 'remote-migrations', '0001_rebuild_posts_fts.sql')
const wranglerToml = readFileSync(join(repoRoot, 'wrangler.toml'), 'utf8')

describe('posts FTS schema', () => {
  it('uses external-content safe triggers for UPDATE and DELETE', () => {
    expect(schemaSql).toContain("INSERT INTO posts_fts(posts_fts, rowid, title, content)")
    expect(schemaSql).toContain("VALUES('delete', old.id, old.title, old.content);")
    expect(schemaSql).not.toContain('UPDATE posts_fts SET title = new.title, content = new.content')
    expect(schemaSql).not.toContain('DELETE FROM posts_fts WHERE rowid = old.id;')
  })

  it('ships a repair SQL file to rebuild the remote FTS index', () => {
    const repairSql = readFileSync(repairSqlPath, 'utf8')

    expect(repairSql).toContain('DROP TABLE IF EXISTS posts_fts;')
    expect(repairSql).toContain('CREATE VIRTUAL TABLE posts_fts USING fts5(')
    expect(repairSql).toContain('INSERT INTO posts_fts(rowid, title, content)')
    expect(repairSql).toContain('SELECT id, title, content FROM posts;')
  })

  it('configures Wrangler to apply remote D1 migrations from the dedicated folder', () => {
    expect(wranglerToml).toContain('migrations_table = "d1_remote_migrations"')
    expect(wranglerToml).toContain('migrations_dir = "db/remote-migrations"')
  })
})
