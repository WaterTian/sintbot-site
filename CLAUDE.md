# sintbot-site

cc-bot 项目的展示 / 宣传网站。纯静态、单页、双语 EN/中。线上：https://sintbot.com

## 技术栈

纯 **HTML / CSS / JS**，零构建工具、零依赖、零框架。单页应用（`index.html`）。

## 文件

- `index.html` — 页面结构
- `styles.css` — 全部样式，原生 CSS 自定义属性，PCB 电路板配色
- `app.js` — 全部行为：i18n、滚动揭示、光标辉光、复制按钮、GoatCounter 埋点
- `assets/` — logo 等静态资源
- `CNAME` — GitHub Pages 自定义域名（`sintbot.com`），**勿删**

## 部署：push 即上线

仓库 `WaterTian/sintbot-site`。**push 到 `main` 分支 = GitHub Pages 自动部署**，几十秒生效。没有预发布环境 —— 改动前想清楚，push 后用 curl 或浏览器验证 https://sintbot.com。

本地预览：浏览器直接打开 `index.html`，或 `python -m http.server 8000`。

## 双语 i18n

- 文案**不要硬编码**在 HTML —— 用 `data-i18n` / `data-i18n-html` / `data-i18n-svg` 属性标记
- 所有字符串集中在 `app.js` 的 `translations` 对象，EN + 中文各一份
- 加新文案 = HTML 标属性 + `translations` 里补两种语言；语言偏好存 localStorage

## 注意事项

- 改样式 / 动效后**务必在 Windows Chrome 上验证** —— 本站踩过多个 Win11 专属的坑（光标辉光不跟随、触摸屏混合设备 pointer 误判）
- 站点接了 **GoatCounter** 统计（dashboard：cc-bot.goatcounter.com）；改 `app.js` 时勿误删 section 6 的事件埋点
- 项目记忆里有更多踩坑经验（光标辉光跨平台、导航 PCB 走线动效、域名配置等），动手前可查

## 当前状态

`sintbot.com` 已完全上线，HTTPS 强制已开启（Let's Encrypt 证书 `CN=sintbot.com`，`http://` 自动 301 跳 HTTPS）。域名与部署链路无遗留待办。

唯一长期事项：Namecheap 域名自动续费已关闭，**2027-04 前需手动续费**。
