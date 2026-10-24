// sitemap.xml 的守卫,由预提交钩子调用(.githooks/pre-commit)。
// ① 页面看得见的文字(正文、<title>、meta description)这次改了,sitemap 里这页的 lastmod 必须是今天;
//    只动脚本、样式、JSON-LD、统计代码不算改文字,不要求刷 —— 文字没变却刷日期,搜索引擎白跑一趟。
// ② 仓库里每个 .html 页面都得在 sitemap 里,sitemap 里的每个网址也得有对应文件。
// 确实不该刷的特例:LASTMOD_SKIP=1 git commit ...
import { execFileSync } from 'node:child_process'
import { visible } from './visible.mjs'

const SITE = 'https://sintbot.com'
// 不是网站页面的 .html:搜索后台验证文件、分享图的设计源文件(_config.yml 里也不发布)
const NOT_PAGES = [/^google[0-9a-f]+\.html$/, /^assets\//]

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
// rev 为空 = 暂存区里的版本(git show :file)
const show = (rev, file) => { try { return git('show', `${rev}:${file}`) } catch { return null } }

const sitemap = show('', 'sitemap.xml')
if (!sitemap) { console.error('check-lastmod: 暂存区里没有 sitemap.xml'); process.exit(1) }
const lastmod = new Map()
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
  let file = m[1].replace(SITE, '').replace(/^\//, '')
  if (file === '' || file.endsWith('/')) file += 'index.html'
  lastmod.set(file, m[2])
}

const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' }) // 北京时间的 YYYY-MM-DD(与 sync-version 一致)
const problems = []

const pages = git('ls-files', '--', '*.html').split('\n').filter((f) => f && !NOT_PAGES.some((re) => re.test(f)))
for (const f of pages) if (!lastmod.has(f)) problems.push(`${f} 不在 sitemap.xml 里(公开页面要加进去;不是页面就加进本脚本的 NOT_PAGES)`)
for (const f of lastmod.keys()) if (!pages.includes(f)) problems.push(`sitemap.xml 里有 ${f},仓库里没有这个文件`)

const staged = new Set(git('diff', '--cached', '--name-only', '--diff-filter=ACMR').split('\n').filter(Boolean))
for (const [f, date] of lastmod) {
  if (!staged.has(f) || visible(show('', f)) === visible(show('HEAD', f))) continue
  if (date < today) problems.push(`${f} 的文字改了,sitemap.xml 里它的 lastmod 还是 ${date},改成 ${today}`)
}

if (!problems.length) {
  console.log('check-lastmod: ok')
} else if (process.env.LASTMOD_SKIP === '1') {
  console.log(`check-lastmod: 已跳过(LASTMOD_SKIP=1)\n  ${problems.join('\n  ')}`)
} else {
  console.error(`check-lastmod:\n  ${problems.join('\n  ')}\n  确实不该改的特例:LASTMOD_SKIP=1 git commit ...`)
  process.exit(1)
}
