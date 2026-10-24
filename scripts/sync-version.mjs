// 官网写的版本号(app.js 的 VERSION:插件卡片 + JSON-LD softwareVersion)跟 npm 上 sintbot 的最新版走。
//   node scripts/sync-version.mjs                  只核对:不一致退出 1
//   node scripts/sync-version.mjs --write          不一致就改:VERSION → 公开仓该版标签的 install.sh → build-zh
//                                                  → 文字变了的页面 sitemap lastmod 改成当天(北京)
//   node scripts/sync-version.mjs --write --target 1.2.3   不查 npm,按给定版本改写(本地验改写结果用,别推)
// 每小时由 .github/workflows/version-sync.yml 跑 --write;有改动它负责提交、请求 Pages 构建、等线上生效。
// 在 GitHub Actions 里会把 changed=0|1、version=V 写进 $GITHUB_OUTPUT。
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { visible } from './visible.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://sintbot.com'
const args = process.argv.slice(2)
const write = args.includes('--write')
const target = args.includes('--target') ? args[args.indexOf('--target') + 1] : null
if (args.includes('--target') && !/^\d+\.\d+\.\d+$/.test(target || '')) throw new Error('--target 要跟一个版本号,如 1.2.3')

const file = (f) => path.join(ROOT, f)
const read = (f) => readFileSync(file(f), 'utf8')
// 取网页用 curl:它认 https_proxy 等代理变量,Node 自带的 fetch 不认(墙内本机直连 raw.githubusercontent.com 会超时)
function get(url) {
  const out = execFileSync('curl', ['-sSL', '--max-time', '30', '-w', '\n%{http_code}', url], { encoding: 'utf8' })
  const i = out.lastIndexOf('\n')
  return { status: Number(out.slice(i + 1)), text: out.slice(0, i) }
}
const output = (k, v) => { if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`) }

const appJs = read('app.js')
const site = (appJs.match(/const VERSION = "([^"]+)";/) || [])[1]
if (!site) throw new Error('app.js 里找不到 const VERSION')

let latest = target
if (!latest) {
  const res = get('https://registry.npmjs.org/sintbot/latest')
  if (res.status !== 200) throw new Error(`npm registry HTTP ${res.status}`)
  latest = JSON.parse(res.text).version
}

if (!write) {
  if (site !== latest) {
    console.error(`官网写的是 v${site},npm 最新是 v${latest}:跑 node scripts/sync-version.mjs --write(或等每小时的自动同步)`)
    process.exit(1)
  }
  console.log(`sync-version: v${site},与 npm 一致`)
  process.exit(0)
}

// sitemap 里的页面 → 改之前的可见文字,build-zh 之后比对
const sitemapXml = read('sitemap.xml')
const pages = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  let f = m[1].replace(SITE, '').replace(/^\//, '')
  if (f === '' || f.endsWith('/')) f += 'index.html'
  return { loc: m[1], f }
})
const before = new Map(pages.map((p) => [p.f, visible(read(p.f))]))
const changed = []

if (site !== latest) {
  writeFileSync(file('app.js'), appJs.replace(`const VERSION = "${site}";`, `const VERSION = "${latest}";`))
  changed.push(`VERSION ${site} → ${latest}`)
}

// 一键安装脚本是公开仓根目录 install.sh 的副本,跟该版标签对齐
const raw = get(`https://raw.githubusercontent.com/sintlab/sintbot/v${latest}/install.sh`)
if (raw.status === 200) {
  const upstream = raw.text
  if (upstream !== read('install.sh')) { writeFileSync(file('install.sh'), upstream); changed.push(`install.sh 换成 v${latest} 标签的版本`) }
} else if (target) {
  console.log(`(标签 v${latest} 取不到 install.sh:HTTP ${raw.status},--target 下跳过)`)
} else {
  throw new Error(`取 v${latest} 标签的 install.sh 失败:HTTP ${raw.status}`)
}

if (!changed.length) {
  console.log(`sync-version: v${site},与 npm 一致,install.sh 也一致,不用改`)
  output('changed', 0); output('version', latest)
  process.exit(0)
}

execFileSync('node', [file('scripts/build-zh.mjs')], { stdio: 'inherit' })

const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' })
let sitemapOut = sitemapXml
for (const p of pages) {
  if (visible(read(p.f)) === before.get(p.f)) continue
  const re = new RegExp(`(<loc>${p.loc.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]+`)
  sitemapOut = sitemapOut.replace(re, `$1${today}`)
  changed.push(`${p.f} 文字有变,lastmod → ${today}`)
}
if (sitemapOut !== sitemapXml) writeFileSync(file('sitemap.xml'), sitemapOut)

console.log(`sync-version:\n  ${changed.join('\n  ')}`)
output('changed', 1); output('version', latest)
