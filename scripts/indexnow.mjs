// IndexNow:把 sitemap.xml 里的网址推给 Bing 等搜索引擎,让它们尽快重新抓取(不需要登录站长后台)。
// 用法:改完站并推送上线后,`node scripts/indexnow.mjs`。
// 密钥文件是站根的 <KEY>.txt,内容就是密钥本身;搜索引擎会回来读它确认网站归属,删了提交就会被拒。
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const HOST = 'sintbot.com'
const KEY = '783f94deea5dcec1f553933e980af9db'

const sitemap = readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8')
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!urlList.length) throw new Error('sitemap.xml 里没有网址')

// 先确认线上的密钥文件对得上,否则提交必被拒
const live = await fetch(`https://${HOST}/${KEY}.txt`).then((r) => (r.ok ? r.text() : `HTTP ${r.status}`))
if (live.trim() !== KEY) throw new Error(`线上密钥文件不对:${live.slice(0, 60)}`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
})
// 200 = 收到;202 = 收到、密钥待校验;其余都是失败
console.log(`IndexNow ${res.status} ${res.statusText} · ${urlList.length} 个网址`)
if (res.status !== 200 && res.status !== 202) {
  console.log(await res.text())
  process.exit(1)
}
