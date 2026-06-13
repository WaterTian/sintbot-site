# sintbot-site

**sintbot 平台**的展示 / 宣传网站。纯静态、单页、双语 EN/中。线上：https://sintbot.com

sintbot 含两根支柱：① **多模型群聊机器人** —— 把 AI agent 接进飞书/Slack 群，cc-bot 是其中已上线的 Claude Code 版；② **桌宠** —— 趴桌面、演开发状态、有性格的虚拟形象。单页同时呈现这两部分。

## 技术栈

纯 **HTML / CSS / JS**，零构建工具、零依赖、零框架。单页应用（`index.html`）。

## 文件

- `index.html` — 页面结构
- `styles.css` — 全部样式，原生 CSS 自定义属性，PCB 电路板配色
- `app.js` — 全部行为：i18n、滚动揭示、光标辉光、复制按钮、Umami 埋点、logo-cycle、hero 视差
- `assets/` — logo 等静态资源
- `CNAME` — GitHub Pages 自定义域名（`sintbot.com`），**勿删**
- `docs/superpowers/` — 2026-05 平台重设计的设计文档（`specs/`）与实现计划（`plans/`）

## 部署：push 即上线

仓库 `WaterTian/sintbot-site`。**push 到 `main` 分支 = GitHub Pages 自动部署**，几十秒生效。没有预发布环境 —— 改动前想清楚，push 后用 curl 或浏览器验证 https://sintbot.com。

本地预览：浏览器直接打开 `index.html`，或 `python -m http.server 8000`。

## 双语 i18n

- 文案**不要硬编码**在 HTML —— 用 `data-i18n` / `data-i18n-html` / `data-i18n-svg` 属性标记
- 所有字符串集中在 `app.js` 的 `translations` 对象，EN + 中文各一份
- 加新文案 = HTML 标属性 + `translations` 里补两种语言；语言偏好存 localStorage

## 注意事项

- 改样式 / 动效后**务必在 Windows Chrome 上验证** —— 本站踩过多个 Win11 专属的坑（光标辉光不跟随、触摸屏混合设备 pointer 误判）
- 站点接了 **Umami** 统计（cloud.umami.is，script 标签在 `index.html` head）；改 `app.js` 时勿误删 section 6 的 `umami.track()` 事件埋点
- 项目记忆里有更多踩坑经验（光标辉光跨平台、导航 PCB 走线动效、域名配置等），动手前可查
- **公开仓库数据红线**：本仓库是 Public。运营/账号/业务文档（含任何个人邮箱、账号信息、
  后台状态）一律放 `.scratch/`（已 gitignore）或项目记忆，**永不 commit**。2026-06 曾因
  合规文档入库泄漏账号邮箱，做过一次全历史重写——别再来一次。git 提交身份用 noreply
  邮箱（仓库级 git config 已设好）。

## 当前状态

`sintbot.com` 已完全上线，HTTPS 强制已开启（Let's Encrypt 证书 `CN=sintbot.com`，`http://` 自动 301 跳 HTTPS）。域名与部署链路无遗留待办。

唯一长期事项：Namecheap 域名自动续费已关闭，**2027-04 前需手动续费**。
