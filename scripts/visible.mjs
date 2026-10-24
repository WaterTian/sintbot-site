// 页面「看得见的文字」:正文、<title>、meta description;去掉注释、脚本、样式与标签。
// check-lastmod(预提交钩子)与 sync-version(定时同步版本号)共用,判断这页的 lastmod 该不该刷。
export function visible(html) {
  if (html == null) return null
  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1] || ''
  const body = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
  return `${desc} ${body}`.replace(/\s+/g, ' ').trim()
}
