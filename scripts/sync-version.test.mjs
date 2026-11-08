import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const scripts = path.dirname(fileURLToPath(import.meta.url))
function fixture(t, { latest = '1.3.0', status = 200 } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sintbot-site-sync-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.mkdirSync(path.join(root, 'scripts')); fs.mkdirSync(path.join(root, 'bin'))
  for (const name of ['sync-version.mjs', 'visible.mjs']) fs.copyFileSync(path.join(scripts, name), path.join(root, 'scripts', name))
  fs.writeFileSync(path.join(root, 'scripts/build-zh.mjs'), 'import fs from "node:fs";fs.writeFileSync(new URL("../built",import.meta.url),"yes")')
  const initial = { 'app.js': 'const VERSION = "1.3.0";\n', 'install.sh': '# reviewed 37-line installer\n', 'sitemap.xml': '<urlset><url><loc>https://sintbot.com/</loc><lastmod>2026-11-08</lastmod></url></urlset>', 'index.html': '<h1>SintBot</h1>' }
  for (const [name, text] of Object.entries(initial)) fs.writeFileSync(path.join(root, name), text)
  fs.writeFileSync(path.join(root, 'bin/curl'), `#!${process.execPath}\nconst fs=require('fs');const u=process.argv.at(-1);fs.appendFileSync(process.env.REQUEST_LOG,u+'\\n');process.stdout.write(u.includes('registry.npmjs.org')?JSON.stringify({version:${JSON.stringify(latest)}})+'\\n200':${JSON.stringify('# new tagged installer\n\n' + status)})`, { mode: 0o755 })
  const read = name => fs.readFileSync(path.join(root, name), 'utf8')
  const run = (...args) => spawnSync(process.execPath, [path.join(root, 'scripts/sync-version.mjs'), ...args], { encoding: 'utf8', env: { ...process.env, PATH: path.join(root, 'bin') + path.delimiter + process.env.PATH, GITHUB_OUTPUT: path.join(root, 'output'), REQUEST_LOG: path.join(root, 'requests') } })
  return { root, initial, read, run }
}
test('same-version --write preserves reviewed installer and all generated files, without requesting tag', t => {
  const f = fixture(t), r = f.run('--write')
  assert.equal(r.status, 0, r.stderr)
  for (const [name, bytes] of Object.entries(f.initial)) assert.equal(f.read(name), bytes)
  assert.equal(f.read('requests').trim(), 'https://registry.npmjs.org/sintbot/latest')
  assert.equal(f.read('output'), 'changed=0\nversion=1.3.0\n')
  assert.equal(fs.existsSync(path.join(f.root, 'built')), false)
})
test('version advance fetches correct tag and regenerates site', t => {
  const f = fixture(t, { latest: '1.3.1' }), r = f.run('--write')
  assert.equal(r.status, 0, r.stderr)
  assert.equal(f.read('app.js'), 'const VERSION = "1.3.1";\n')
  assert.equal(f.read('install.sh'), '# new tagged installer\n')
  assert.match(f.read('requests'), /v1\.3\.1\/install\.sh/)
  assert.equal(f.read('built'), 'yes')
  assert.equal(f.read('output'), 'changed=1\nversion=1.3.1\n')
})
test('missing production tag does not advance version or overwrite current installer', t => {
  const f = fixture(t, { latest: '1.3.1', status: 404 }), r = f.run('--write')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /HTTP 404/)
  for (const [name, bytes] of Object.entries(f.initial)) assert.equal(f.read(name), bytes)
})
test('same explicit target also preserves a post-tag installer fix', t => {
  const f = fixture(t), r = f.run('--write', '--target', '1.3.0')
  assert.equal(r.status, 0, r.stderr)
  assert.equal(f.read('install.sh'), f.initial['install.sh'])
  assert.equal(fs.existsSync(path.join(f.root, 'requests')), false)
})
