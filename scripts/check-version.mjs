// 官网写的版本号(app.js 的 VERSION:插件卡片 + JSON-LD softwareVersion)要跟 npm 上 sintbot 的最新版一致。
// 每天由 .github/workflows/version-check.yml 跑;发版后忘了改,这一步失败,GitHub 会发邮件提醒。
// 本机也能跑:node scripts/check-version.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = (readFileSync(path.join(ROOT, 'app.js'), 'utf8').match(/const VERSION = "([^"]+)";/) || [])[1]
if (!site) throw new Error('app.js 里找不到 const VERSION')

const res = await fetch('https://registry.npmjs.org/sintbot/latest')
if (!res.ok) throw new Error(`npm registry HTTP ${res.status}`)
const latest = (await res.json()).version

if (site !== latest) {
  console.error(`官网写的是 v${site},npm 最新是 v${latest}:改 app.js 的 VERSION,跑 node scripts/build-zh.mjs,提交推送`)
  process.exit(1)
}
console.log(`check-version: v${site},与 npm 一致`)
